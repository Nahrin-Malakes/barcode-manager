import { createProtectedRouter } from "@/trpc/router/protected-router";
import { z } from "zod";

// Example router with queries that can only be hit if the user requesting is signed in
export const userRouter = createProtectedRouter()
  .mutation("logout-user", {
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
  })
  .query("is-admin", {
    async resolve({ ctx }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!user)
        return {
          isAdmin: false,
        };

      if (user.role !== "ADMIN")
        return {
          isAdmin: false,
        };

      return {
        isAdmin: true,
      };
    },
  })
  .query("get-sessions", {
    async resolve({ ctx }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!user)
        return {
          sessions: null,
        };

      if (user.role !== "ADMIN")
        return {
          sessions: null,
        };

      const sessions = await ctx.prisma.session.findMany({
        where: {
          NOT: {
            userId: user.id,
          },
        },
        include: {
          user: true,
        },
      });

      return { sessions };
    },
  });
