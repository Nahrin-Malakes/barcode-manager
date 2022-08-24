import { createProtectedRouter } from "@/trpc/router/protected-router";
import { z } from "zod";

// Example router with queries that can only be hit if the user requesting is signed in
export const userRouter = createProtectedRouter().mutation("logout-user", {
  input: z.object({
    sessionId: z.string(),
    userId: z.string(),
  }),
  async resolve({ ctx, input }) {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    if (!user || user.role !== "ADMIN") return;

    const sessionOwner = await ctx.prisma.user.findUnique({
      where: {
        id: input.userId,
      },
    });
    if (!sessionOwner) return;

    await ctx.prisma.session.delete({
      where: {
        id: input.sessionId,
      },
    });

    return true;
  },
});

