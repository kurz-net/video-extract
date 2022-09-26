import { Prisma, PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaOptions: Prisma.PrismaClientOptions = {};

export const prisma = global.prisma || new PrismaClient(prismaOptions);

export const customPrisma = (options: Prisma.PrismaClientOptions) =>
  new PrismaClient({ ...prismaOptions, ...options });

if (process.env["NODE_ENV"] !== "production") {
  global.prisma = prisma;
}
