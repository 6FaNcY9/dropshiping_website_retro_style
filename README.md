# Dropship Store Platform

A full-stack dropshipping e-commerce starter built with Next.js 14 (App Router), Prisma, and PostgreSQL. It includes customer storefront pages, account area, admin scaffolding, supplier connectors, and production-ready integrations for payments, email, storage, and shipping.

## Prerequisites

- Node.js 20
- PostgreSQL database
- Stripe account + CLI (for local webhooks)
- Resend API key for transactional email
- S3-compatible storage (AWS S3 or Cloudflare R2)
- Shippo API token for shipping rates/labels

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values. Missing values will disable the related feature at runtime instead of breaking the build:

- App/base URL: `NEXT_PUBLIC_APP_URL` (defaults to `https://$VERCEL_URL` on Vercel or `http://localhost:3000` locally)
- Database (required for auth/orders): `DATABASE_URL`, `DIRECT_URL`
- Auth providers (optional): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Stripe Checkout (optional, required to sell): `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL`
- Cloudflare Turnstile (optional): `TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_BYPASS`
- Cloudflare R2 uploads (optional): `R2_ENDPOINT`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_BASE_URL`
- Admin uploads: `ADMIN_ACCESS_TOKEN` (optional override header)
- Email (optional): `RESEND_API_KEY`
- Shipping (optional): `SHIPPO_API_TOKEN`
- Rate limiting (optional): `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- Cron (required for scheduled jobs): `CRON_SECRET`

Runtime env handling is lazy in `src/lib/env/runtime.ts`: builds succeed without secrets, and endpoints respond with `503` and a list of required variables until configured.

### Deploy without secrets (feature flags off)
- The app will build and deploy even if Stripe/R2/Turnstile/DB credentials are missing.
- Impact:
  - Checkout + webhooks return `503` until Stripe keys are set.
  - Uploads return `503` until R2 is configured.
  - Auth and checkout Turnstile checks are bypassed (with a warning) until keys are provided.
  - Database-backed routes return `503` until `DATABASE_URL` is set.

### Vercel environment variables
- Set variables in **Project Settings → Environment Variables** (Production/Preview/Development).
- `NEXT_PUBLIC_APP_URL` can be omitted; `VERCEL_URL` will be used automatically.
- Redeploy after any env var change so Next.js picks up the new values.

## Installation

```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Available scripts

- `npm run dev` – start Next.js dev server
- `npm run build` / `npm run start` – production build and serve
- `npm run lint` – ESLint with Prettier integration
- `npm run typecheck` – TypeScript type checks
- `npm run test` – Vitest unit/integration tests
- `npm run test:e2e` – Playwright end-to-end suite
- `npm run prisma:migrate` – Prisma migrations for dev
- `npm run prisma:studio` – Open Prisma Studio
- `npm run prisma:seed` – Seed local data

## Local webhook testing (Stripe)

1. Start the dev server: `npm run dev`
2. In another terminal, run:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
3. Complete a Checkout Session using test cards. Webhook events will hit the local handler.

Orders are created from webhook payloads with idempotency checks so retries do not duplicate payments. Checkout sessions are
created through `/api/checkout/create` with server-calculated prices from Prisma.

## Cloudflare R2 setup

1. Create an R2 bucket and an access key pair.
2. Add the `R2_ENDPOINT`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, and `R2_SECRET_ACCESS_KEY` values to your environment.
3. Configure a public base URL (custom domain or R2 public URL) and set `R2_PUBLIC_BASE_URL` accordingly.
4. Use the admin upload page at `/admin/uploads` (admin user only) to request a presigned URL and upload directly from the
   browser. You can also call `/api/uploads/presign` programmatically with an `x-admin-token` header matching
   `ADMIN_ACCESS_TOKEN`.
5. Allow your app origin (e.g., `http://localhost:3000` and your production domain) in the R2 CORS configuration so the
   browser can send `PUT`/`GET` requests to the presigned URLs.

## Cloudflare Turnstile

1. Create a Turnstile site and obtain a site key + secret key.
2. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SITE_KEY`, and `TURNSTILE_SECRET_KEY` in your environment.
3. Turnstile is enforced on signup/login and checkout session creation. For local development you can set
   `TURNSTILE_BYPASS=true`.

## Deployment (Vercel)

1. Create a Postgres database (Neon/Supabase/Railway).
2. Add all environment variables in Vercel project settings.
3. Run `npm run build` to verify.
4. Configure Stripe webhook endpoint to `https://<your-app>/api/webhooks/stripe`.
5. (Optional) Configure cron jobs in `vercel.json` to hit `/api/cron/sync-inventory` and `/api/cron/sync-tracking`.

### Vercel build settings

- **Install Command:** `npm install`
- **Build Command:** `npm run build`
- **Output Directory:** `.vercel/output` (generated by `scripts/prepare-vercel-output.js` after `next build`)

These defaults match what `vercel build` runs locally. If you adjust the build command, ensure the output directory still
points to `.vercel/output` so deployments can serve the Next.js output properly.

## Security checklist

- No secrets committed; all configured via env vars
- Enforce rate limiting on auth/checkout/webhooks
- Webhooks are signature verified and idempotent
- Prices and totals are calculated server-side from the database
- Admin actions produce audit logs
- GDPR basics covered with privacy/terms/shipping/returns/impressum pages
