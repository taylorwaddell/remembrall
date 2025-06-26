import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

const openai = new OpenAI();

const AITagFormat = z.object({
  tags: z.string().array(),
});

const prompt = `You are a tagging assistant. Given user's content, generate 3-10 single-word lowercase tags related to ONLY the content provided. Return ONLY the tags. Each tag should have a '#' leading them and each should be separated by a comma.
    Examples:
    Content: 'iPhone 13 review' → #iphone, #phone, #review, #apple, #mobile
    Content: 'pizza recipe' → #pizza, #recipe, #cooking, #food, #italian`;

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
        select: { text: true },
        where: {
          text: { contains: input.query },
          OR: [{ tags: { some: { text: { contains: input.query } } } }],
          userId: { equals: ctx.session.user.id },
        },
        take: 5,
      });
      return nodes;
    }),
});
