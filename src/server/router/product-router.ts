import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "@/trpc/router/protected-router";

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
  .mutation("getByBarcodeOrName", {
    input: z.object({
      barcodeName: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;

      if (input.barcodeName) {
        const fetchProduct = await prisma.product.findUnique({
          where: {
            barcode: input.barcodeName,
          },
        });
        if (!fetchProduct) {
          console.error("Product not found by id, retrying with name");
          const fetchByName = await prisma.product.findMany({
            where: {
              name: input.barcodeName,
            },
          });

          if (!fetchByName) {
            return {
              error: {
                code: "0003",
                message: "Product not found",
              },
            };
          }

          return {
            fetchByName,
          };
        }
        return {
          fetchProduct,
        };
      }
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
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (
        fetchProduct.userId !== ctx.session.user.id ||
        user.role !== "ADMIN"
      ) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await prisma.product.delete({
        where: {
          barcode: input.barcode,
        },
      });

      return {
        data: {
          success: true,
        },
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

      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (
        fetchProduct.userId !== ctx.session.user.id ||
        user.role !== "ADMIN"
      ) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
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
      const products = await prisma.product.findMany({
        orderBy: [{ updatedAt: "desc" }],
      });
      return products;
    },
  });
