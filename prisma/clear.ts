import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function clear() {
  await prisma.videoClip.deleteMany()
  await prisma.video.deleteMany()
}

clear()
 .catch((e) => {
    console.error(`There was an error while clearing: ${e}`);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Successfully cleared database. Closing connection.');
    await prisma.$disconnect();
  });
