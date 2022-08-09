// src/server/router/index.ts
import superjson from "superjson";

import { createRouter } from "@/trpc/router/context";
import { productRouter } from "@/trpc/router/product-router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("product.", productRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

