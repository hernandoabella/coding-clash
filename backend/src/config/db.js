// src/config/db.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["error", "warn"]
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected (Prisma)");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

export default prisma;
