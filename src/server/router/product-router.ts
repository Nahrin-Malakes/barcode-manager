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
  .query("getAll", {
    async resolve({ ctx: { prisma } }) {
      return await prisma.product.findMany();
    },
  });

