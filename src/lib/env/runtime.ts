import { z } from "zod";

const envSchema = z
  .object({
    DATABASE_URL: z.string().optional(),
    DIRECT_URL: z.string().optional(),
    NEXTAUTH_URL: z.string().optional(),
    NEXTAUTH_SECRET: z.string().optional(),
    AUTH_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    STRIPE_SUCCESS_URL: z.string().optional(),
    STRIPE_CANCEL_URL: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    R2_ENDPOINT: z.string().optional(),
    R2_BUCKET: z.string().optional(),
    R2_ACCESS_KEY_ID: z.string().optional(),
    R2_SECRET_ACCESS_KEY: z.string().optional(),
    R2_PUBLIC_BASE_URL: z.string().optional(),
    SHIPPO_API_TOKEN: z.string().optional(),
    UPSTASH_REDIS_REST_URL: z.string().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    CRON_SECRET: z.string().optional(),
    TURNSTILE_SITE_KEY: z.string().optional(),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
    TURNSTILE_SECRET_KEY: z.string().optional(),
    TURNSTILE_BYPASS: z
      .string()
      .optional()
      .transform((val) => val === "true"),
    ADMIN_ACCESS_TOKEN: z.string().optional(),
    SKIP_ENV_VALIDATION: z.string().optional(),
    VERCEL_URL: z.string().optional(),
  })
  .passthrough();

type EnvOutput = z.infer<typeof envSchema>;

export type Env = EnvOutput & {
  HAS_DB: boolean;
  HAS_STRIPE: boolean;
  HAS_R2: boolean;
  HAS_TURNSTILE: boolean;
  APP_URL: string;
};

let cachedEnv: Env | null = null;
let validationWarningLogged = false;

function normalizeEnv(): Record<string, string | undefined> {
  return Object.entries(process.env).reduce<Record<string, string | undefined>>(
    (acc, [key, value]) => {
      acc[key] = value?.trim() ? value : undefined;
      return acc;
    },
    {},
  );
}

function computeAppUrl(env: EnvOutput) {
  if (env.NEXT_PUBLIC_APP_URL) return env.NEXT_PUBLIC_APP_URL;
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const normalized = normalizeEnv();
  const parsed = envSchema.safeParse(normalized);

  if (!parsed.success && normalized.SKIP_ENV_VALIDATION !== "true") {
    if (!validationWarningLogged) {
      console.warn(
        "Environment validation failed; continuing with best-effort values. Missing secrets will disable related features until configured.",
        parsed.error.format(),
      );
      validationWarningLogged = true;
    }
  }

  const baseEnv: EnvOutput = parsed.success
    ? parsed.data
    : {
        ...normalized,
        TURNSTILE_BYPASS: normalized.TURNSTILE_BYPASS === "true",
      };
  const APP_URL = computeAppUrl(baseEnv);

  cachedEnv = {
    ...baseEnv,
    APP_URL,
    HAS_DB: Boolean(baseEnv.DATABASE_URL),
    HAS_STRIPE: Boolean(
      baseEnv.STRIPE_SECRET_KEY &&
      baseEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
      baseEnv.STRIPE_WEBHOOK_SECRET &&
      baseEnv.STRIPE_SUCCESS_URL &&
      baseEnv.STRIPE_CANCEL_URL,
    ),
    HAS_R2: Boolean(
      baseEnv.R2_ENDPOINT &&
      baseEnv.R2_BUCKET &&
      baseEnv.R2_ACCESS_KEY_ID &&
      baseEnv.R2_SECRET_ACCESS_KEY &&
      baseEnv.R2_PUBLIC_BASE_URL,
    ),
    HAS_TURNSTILE: Boolean(
      baseEnv.TURNSTILE_SECRET_KEY && baseEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    ),
  } satisfies Env;

  return cachedEnv;
}

type EnvKey = Extract<keyof Env, string>;

export function requireEnv(keys: Array<EnvKey | string>) {
  const env = getEnv();
  const missing = keys
    .map((key) => String(key))
    .filter((key) => {
      const value = env[key as EnvKey];
      return value === undefined || value === "";
    });

  return {
    ok: missing.length === 0,
    missing,
    env,
  } as const;
}

export function clearEnvCache() {
  cachedEnv = null;
  validationWarningLogged = false;
}
