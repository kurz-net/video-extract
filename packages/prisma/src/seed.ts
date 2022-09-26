import { PrismaClient } from "@prisma/client";
import { clear } from "./utils";
const prisma = new PrismaClient();

async function seed() {
  await clear(prisma)

  await prisma.video.create({
    data: {
      progress: 0,
      failed: false,
      uuid: "ba79de25-c99a-4863-973c-e831715a35c7",
      originUrl: "https://www.youtube.com/watch?v=x2eF3YLiNhY",
    }
  })
  await prisma.video.create({
    data: {
      progress: 0,
      failed: false,
      uuid: "9d24e7de-f1ef-4fdb-a93d-5dc3785233ef",
      originUrl: "https://www.youtube.com/watch?v=Wqy3PBEglXQ",
    }
  })
  await prisma.video.create({
    data: {
      progress: 0,
      failed: false,
      uuid: "8c6f3300-356a-4574-ab1b-0dff5a06bd77",
      originUrl: "https://www.youtube.com/watch?v=0K3Yk8hv2Ug",
    }
  })
  await prisma.video.create({
    data: {
      progress: 0,
      failed: false,
      uuid: "9e65073a-86a0-4d7c-9b1d-e74b51881cb2",
      originUrl: "https://www.youtube.com/watch?v=jd5JwXoDXFo",
    }
  })
}

seed()
 .catch((e) => {
    console.error(`There was an error while seeding: ${e}`);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Successfully seeded database. Closing connection.');
    await prisma.$disconnect();
  });
