import { PrismaClient } from "@prisma/client";
import { requireEnv } from "./env";

export class MissingEnvError extends Error {
  constructor(public missing: string[]) {
    super(
      `Missing required environment variables: ${missing.join(", ")}. Update your deployment settings and redeploy.`,
    );
  }
}

type GlobalWithPrisma = typeof globalThis & {
  _prisma?: PrismaClient;
};

const globalWithPrisma = globalThis as GlobalWithPrisma;

type PrismaResolution =
  | { ok: true; prisma: PrismaClient }
  | { ok: false; missing: string[] };

export function resolvePrisma(): PrismaResolution {
  const envCheck = requireEnv(["DATABASE_URL"]);
  if (!envCheck.ok) {
    return { ok: false, missing: envCheck.missing };
  }

  if (!globalWithPrisma._prisma) {
    globalWithPrisma._prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
      datasources: {
        db: {
          url: envCheck.env.DATABASE_URL,
        },
      },
    });
  }

  return { ok: true, prisma: globalWithPrisma._prisma };
}

export function getPrisma() {
  const resolved = resolvePrisma();
  if (!resolved.ok) {
    throw new MissingEnvError(resolved.missing);
  }

  return resolved.prisma;
}
