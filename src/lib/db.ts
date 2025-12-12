import { PrismaClient } from "@prisma/client";
import { getEnv } from "./env";

type GlobalWithPrisma = typeof globalThis & {
  _prisma?: PrismaClient;
};

const globalWithPrisma = globalThis as GlobalWithPrisma;

export function getPrisma() {
  const env = getEnv();

  if (!env.DATABASE_URL) {
    throw new Error(
      "Database not configured. Set DATABASE_URL in your environment to enable data access.",
    );
  }

  if (!globalWithPrisma._prisma) {
    globalWithPrisma._prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  }

  return globalWithPrisma._prisma;
}
