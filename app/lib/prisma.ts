// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // allow global prisma in dev to prevent multiple instances
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"], // optional: log queries, useful in dev
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
