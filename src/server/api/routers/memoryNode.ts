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
      // probably a good option: http://prisma.io/docs/orm/prisma-client/queries/full-text-search
      const node = await ctx.db.memoryNode.create({
        data: {
          text: input.userText,
          userId: ctx.session.user.id,
          created: new Date(),
        },
      });
      return node ?? null;
    }),
});
