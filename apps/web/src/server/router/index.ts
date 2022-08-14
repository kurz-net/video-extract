import { createRouter } from "./context";
import superjson from "superjson";

import { videoRouter } from "./server";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge(videoRouter);

export type AppRouter = typeof appRouter;
