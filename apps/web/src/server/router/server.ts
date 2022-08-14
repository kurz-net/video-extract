import { createRouter } from "./context";
import prisma from "../../utils/prisma"
import { z } from "zod";

export const videoRouter = createRouter()
  .query("videos", {
    async resolve() {
      const videos = await prisma.video.findMany({
        include: {
          _count: {
            select: {
              clips: true
            }
          }
        }
      })
      return videos
    },
  })
  .query("video", {
    input: z.object({ uuid: z.string() }),
    async resolve({ input: { uuid } }) {
      const video = await prisma.video.findFirst({
        where: { uuid },
        include: {
          clips: true
        }
      })
      return video
    }
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
  .mutation("createClip", {
    input: z.object({
      videoUuid: z.string(),
      startTime: z.number(),
      endTime: z.number(),
      title: z.string().nullable()
    }),
    async resolve({ input }) {
      const videoClip = await prisma.videoClip.create({
        data: {
          videoId: input.videoUuid,
          startTime: input.startTime,
          endTime: input.endTime,
          title: input.title || ""
        }
      })
      return videoClip
    }
  })

