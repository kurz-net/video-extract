import * as trpc from "@trpc/server";
import { z } from "zod";
import { Context } from "./context";

export const appRouter = trpc
  .router<Context>()
  .query("getUser", {
    async resolve({ ctx, input }) {
      return { id: "test", name: "Bilbo" };
    },
  })
  .mutation("createUser", {
    // validate input with Zod
    input: z.object({ name: z.string().min(5) }),
    async resolve({ ctx, input }) {
      // use your ORM of choice
      return { message: "hello world" };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;
