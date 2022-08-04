import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

// Example router with queries that can only be hit if the user requesting is signed in
export const productRouter = createProtectedRouter()
  .query("getSession", {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string(),
      barcode: z.string(),
      price: z.number(),
    }),
    async resolve({ input, ctx }) {
      const { session, prisma } = ctx;

      if (!session.user || !session.user.id) {
        return {
          error: {
            code: "0002",
            message: "Not authenticated",
          },
        };
      }

      const fetchProduct = await prisma.product.findUnique({
        where: {
          barcode: input.barcode,
        },
      });
      if (fetchProduct) {
        return {
          error: {
            code: "0001",
            message: "Product already exists",
          },
        };
      }

      const createProduct = await prisma.product.create({
        data: {
          name: input.name,
          barcode: input.barcode,
          price: input.price,
          userId: session.user.id,
        },
      });

      return {
        createProduct,
      };
    },
  })
  .mutation("getByBarcode", {
    input: z.object({
      barcode: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;

      const fetchProduct = await prisma.product.findUnique({
        where: {
          barcode: input.barcode,
        },
      });
      if (!fetchProduct) {
        return {
          error: {
            code: "0003",
            message: "Product not found",
          },
        };
      }

      return {
        fetchProduct,
      };
    },
  })
  .mutation("deleteByBarcode", {
    input: z.object({
      barcode: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;

      const fetchProduct = await prisma.product.findUnique({
        where: {
          barcode: input.barcode,
        },
      });
      if (!fetchProduct) {
        return {
          error: {
            code: "0003",
            message: "Product not found",
          },
        };
      }

      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!user) {
        return {
          code: "0005",
          message: "The owner of the product does not exists anymore",
        };
      }

      if (
        fetchProduct.userId !== ctx.session.user.id ||
        user.role !== "ADMIN"
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "User does not owning the product or not authorized to do this action",
        });
      }

      await prisma.product.delete({
        where: {
          barcode: input.barcode,
        },
      });

      return {
        success: true,
      };
    },
  })
  .mutation("editByBarcode", {
    input: z.object({
      barcode: z.string(),
      name: z.string(),
      price: z.number(),
    }),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;

      const fetchProduct = await prisma.product.findUnique({
        where: {
          barcode: input.barcode,
        },
      });
      if (!fetchProduct) {
        return {
          error: {
            code: "0003",
            message: "Product not found",
          },
        };
      }

      const updatedProduct = await prisma.product.update({
        where: {
          barcode: input.barcode,
        },
        data: {
          name: input.name,
          price: input.price,
        },
      });

      return {
        updatedProduct,
      };
    },
  })
  .query("getAll", {
    async resolve({ ctx: { prisma } }) {
      return await prisma.product.findMany({
        orderBy: [{ updatedAt: "desc" }],
      });
    },
  });
