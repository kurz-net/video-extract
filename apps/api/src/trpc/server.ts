import * as trpc from "@trpc/server";
import { Context } from "./context";
import prisma from "../prisma"
import { z } from "zod";

export const appRouter = trpc
  .router<Context>()
  .query("videos", {
    async resolve() {
      const videos = await prisma.video.findMany()
      return videos
    },
  })
  .mutation("createVideo", {
    input: z.object({
      url: z.string().url()
    }),
    async resolve({ input }) {
      const video = await prisma.video.create({
        data: {
          originUrl: input.url
        }
      })
      return video
    }
  })

export type AppRouter = typeof appRouter;
