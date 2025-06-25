import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { z } from "zod";

export const memoryNodeRouter = createTRPCRouter({
  createMemoryNode: protectedProcedure
    .input(
      z.object({
        userText: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const node = await ctx.db.memoryNode.create({
        data: {
          text: input.userText,
          userId: ctx.session.user.id,
          created: new Date(),
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
          userId: { equals: ctx.session.user.id },
        },
        take: 5,
      });
      return nodes;
    }),
});
