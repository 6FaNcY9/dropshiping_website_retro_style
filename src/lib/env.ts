import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().min(1, "Stripe secret key is required"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "Stripe publishable key is required"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "Stripe webhook secret is required"),
  STRIPE_SUCCESS_URL: z.string().url(),
  STRIPE_CANCEL_URL: z.string().url(),
  RESEND_API_KEY: z.string().optional(),
  R2_ENDPOINT: z.string().url(),
  R2_BUCKET: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_PUBLIC_BASE_URL: z.string().url(),
  SHIPPO_API_TOKEN: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  CRON_SECRET: z.string().min(1, "CRON_SECRET is required"),
  TURNSTILE_SITE_KEY: z.string().min(1),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  TURNSTILE_BYPASS: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
  ADMIN_ACCESS_TOKEN: z.string().optional(),
});
const testDefaults = {
  DATABASE_URL: "postgresql://user:password@localhost:5432/dropshipping",
  NEXTAUTH_URL: "http://localhost:3000",
  NEXTAUTH_SECRET: "test-secret",
  AUTH_SECRET: "test-secret",
  STRIPE_SECRET_KEY: "sk_test_dummy",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_dummy",
  STRIPE_WEBHOOK_SECRET: "whsec_test",
  STRIPE_SUCCESS_URL: "http://localhost:3000/checkout/success",
  STRIPE_CANCEL_URL: "http://localhost:3000/checkout/cancel",
  R2_ENDPOINT: "https://example.com",
  R2_BUCKET: "bucket",
  R2_ACCESS_KEY_ID: "test",
  R2_SECRET_ACCESS_KEY: "test",
  R2_PUBLIC_BASE_URL: "https://example.com/public",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  CRON_SECRET: "test-cron",
  TURNSTILE_SITE_KEY: "test-site-key",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "test-site-key",
  TURNSTILE_SECRET_KEY: "test-secret-key",
};

const parsed = envSchema.safeParse({
  ...(process.env.NODE_ENV === "test" ? testDefaults : {}),
  ...process.env,
});

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
