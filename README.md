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
Copy `.env.example` to `.env.local` and fill in values:
- Database: `DATABASE_URL`, `DIRECT_URL`
- Auth: `AUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Payments: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- Email: `RESEND_API_KEY`
- Storage: `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET`
- Shipping: `SHIPPO_API_TOKEN`
- Rate limiting: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- App/Jobs: `PUBLIC_APP_URL`, `CRON_SECRET`

Validation lives in `src/lib/env.ts` and will throw on missing/invalid values at runtime.

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

## Deployment (Vercel)
1. Create a Postgres database (Neon/Supabase/Railway).
2. Add all environment variables in Vercel project settings.
3. Run `npm run build` to verify.
4. Configure Stripe webhook endpoint to `https://<your-app>/api/webhooks/stripe`.
5. (Optional) Configure cron jobs in `vercel.json` to hit `/api/cron/sync-inventory` and `/api/cron/sync-tracking`.

## Security checklist
- No secrets committed; all configured via env vars
- Enforce rate limiting on auth/checkout/webhooks
- Webhooks are signature verified and idempotent
- Prices and totals are calculated server-side from the database
- Admin actions produce audit logs
- GDPR basics covered with privacy/terms/shipping/returns/impressum pages
