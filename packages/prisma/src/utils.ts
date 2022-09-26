import { PrismaClient } from "@prisma/client";

export async function clear(prisma: PrismaClient) {
  await prisma.videoClip.deleteMany()
  await prisma.video.deleteMany()
}