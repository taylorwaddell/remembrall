import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

const openai = new OpenAI({ apiKey: process.env.AUTH_OPENAI_API_KEY });

const AITagFormat = z.object({
  tags: z.string().array(),
});

const prompt = `
You are a tagging assistant. Given the user's content, generate 3 to 10 single-word, lowercase tags that are directly related to the provided content. Return ONLY the tags, with each tag prefixed by a '#', and separated by commas. Do not include any additional text or formatting.
Examples:
Content: 'iPhone 13 review' → #iphone, #phone, #review, #apple, #mobile
Content: 'pizza recipe' → #pizza, #recipe, #cooking, #food, #italian

## Output Format
- Output must be a JSON array of string tags.
- Each tag must start with a '#' .
- Generate a minimum of 3 and a maximum of 10 tags per input. If the content does not provide enough context for 3 tags, output as many relevant tags as possible (including cases where only 1 or 2 tags can be generated). Do not duplicate tags. If there are no readable words return no tags.
`;

export const memoryNodeRouter = createTRPCRouter({
  createMemoryNode: protectedProcedure
    .input(
      z.object({
        userText: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const aiResponse = await openai.responses.parse({
        model: "chatgpt-4o-latest",
        input: [
          {
            role: "system",
            content: prompt,
          },
          { role: "user", content: input.userText },
        ],
        text: {
          format: zodTextFormat(AITagFormat, "event"),
        },
      });
      const output = aiResponse.output_parsed;
      const node = await ctx.db.memoryNode.create({
        data: {
          text: input.userText,
          userId: ctx.session.user.id,
          created: new Date(),
          tags: {
            create: output?.tags.map((tag) => ({
              text: tag,
            })),
          },
        },
      });
      return node ?? null;
    }),
  getMemoryNodesByUserId: protectedProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      // probably a good option: http://prisma.io/docs/orm/prisma-client/queries/full-text-search
      const nodes = ctx.db.memoryNode.findMany({
        where: {
          OR: [
            { tags: { some: { text: { contains: input.query } } } },
            { text: { contains: input.query } },
          ],
          userId: { equals: ctx.session.user.id },
        },
        select: { text: true },
        take: 5,
      });
      return nodes;
    }),
});
