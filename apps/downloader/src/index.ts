import { PrismaClient } from "@prisma/client"
import fs from "fs-extra"
import ytdl from "ytdl-core"
import { v4 as uuidv4 } from "uuid"
import path from "path"

const prisma = new PrismaClient()

async function downloadVideos() {
  return new Promise<void>(async (res) => {
    const video = await prisma.video.findFirst({
      where: {
        progress: 0,
        failed: false
      }
    })
    if (!video) {
      res()
      return;
    }

    const info = await ytdl.getInfo(video.originUrl)
    const { videoDetails: { title } } = info
    await prisma.video.update({
      where: { id: video.id },
      data: { title }
    })

    const uuid = uuidv4()
    const filePath = path.resolve(`${uuid}.mp4`)

    const stream = ytdl(video.originUrl)
    stream.pipe(fs.createWriteStream(filePath))
    let ts = Date.now()
    stream.on("progress", async (_, downloaded, total) => {
      const progress = Math.ceil(downloaded / total * 100);

      const diff = Date.now() - ts
      if (diff % 1000 === 0) {
        await prisma.video.update({
          where: { id: video.id },
          data: { progress }
        })
      }
      ts = Date.now()
    });
    stream.on("error", async () => {
      await prisma.video.update({
        where: { id: video.id },
        data: { failed: true }
      })
      res()
    })
    stream.on("end", async () => {
      await prisma.video.update({
        where: { id: video.id },
        data: {
          progress: 100,
          fileUrl: filePath
        }
      })
      res()
    })
  })
}

async function main() {
  while(true) {
    await downloadVideos()
  }
}

main()
  .catch(e => {
    console.log("Error:", e)
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
