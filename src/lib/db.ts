import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
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
    // requireEnv validated DATABASE_URL, so it is safe to assert non-null here.
    const connectionString = envCheck.env.DATABASE_URL!;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);

    globalWithPrisma._prisma = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
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