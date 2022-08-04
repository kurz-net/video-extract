import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
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
