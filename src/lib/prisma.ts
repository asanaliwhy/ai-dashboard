import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as { prisma?: PrismaClient };

const prismaInstance =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaInstance;
}

// Extend type definition so IDE Language Servers always recognize the File model
export const prisma = prismaInstance as PrismaClient & { file: any };