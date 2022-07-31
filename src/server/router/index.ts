// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { productRouter } from "./product-router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("product.", productRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

