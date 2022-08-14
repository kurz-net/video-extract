import { PrismaClient } from "@prisma/client"
import fs from "fs-extra"
import ytdl from "ytdl-core"
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

    const filePath = path.resolve(`./files/${video.uuid}.mp4`)

    const stream = ytdl(video.originUrl)
    stream.pipe(fs.createWriteStream(filePath))
    let ts = Date.now()
    stream.on("progress", async (_, downloaded, total) => {
      const progress = Math.ceil(downloaded / total * 100);

      const diff = Date.now() - ts
      if (diff % 1000 === 0) {
        try {
          await prisma.video.update({
            where: { id: video.id },
            data: { progress }
          })
        } catch(e) {}
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
