# Dropship Store Platform

A full-stack dropshipping e-commerce platform for **multi-category products** (electronics, home, fashion, beauty, etc.). Includes **user accounts**, **profiles**, **product catalog**, **cart + checkout**, **order tracking**, **admin dashboard**, and **supplier/shipping/payment integrations**.

---

## What this project does

This platform lets customers browse products, create accounts, purchase items, and track orders. Admins can manage products, pricing, orders, and supplier mappings. The system supports “dropshipping-style” fulfillment by linking store products to supplier SKUs and triggering fulfillment through supplier connectors.

---

## Features

### Customer Features
- Sign up / login / logout (email-password + optional OAuth)
- Account area:
  - Profile (name, phone, preferences)
  - Address book (shipping/billing)
  - Password reset
  - Order history + order detail view
- Product browsing:
  - Categories + collections
  - Search, filters (price, rating, tags), sorting
  - Product pages with images, variants (size/color), stock indicator
- Cart:
  - Guest cart + user cart
  - Merge cart on login
  - Shipping estimator
  - Coupons/discount codes
- Checkout:
  - Taxes + shipping methods
  - Payment provider integration (Stripe recommended)
  - Confirmation page
- Order tracking:
  - Status updates
  - Tracking link and shipment events
- Email notifications:
  - Welcome, password reset
  - Order confirmation, shipping update, refund/return updates

### Admin / Staff Features
- Admin dashboard (RBAC roles: Admin / Support / Fulfillment)
- Product management:
  - Create/update products, variants, images, categories
  - Bulk import (CSV)
  - Pricing rules (cost -> margin -> retail)
- Orders:
  - View/edit status
  - Add tracking numbers
  - Handle cancellations and refunds
- Customers:
  - Search users
  - View order history
  - Support notes
- Promotions:
  - Coupons, discounts, featured collections
- Audit logs:
  - Track admin actions (who changed what, when)

### Dropshipping / Operations
- Supplier Connector layer (plug-and-play)
  - Import supplier catalog
  - Map store variants to supplier SKUs
  - Sync inventory + price
  - Create fulfillment orders
  - Fetch tracking updates
- Background jobs:
  - Scheduled inventory sync
  - Email sending
  - Webhook processing with idempotency

---

## Suggested Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind
- **Backend**: Next.js Server Actions / API routes (or separate API)
- **DB**: Postgres + Prisma
- **Auth**: Auth.js / NextAuth (or Clerk/Supabase Auth)
- **Payments**: Stripe + webhooks
- **Storage**: S3-compatible (AWS S3 / Cloudflare R2)
- **Email**: Resend / Postmark / SendGrid
- **Search (optional)**: Meilisearch / Algolia
- **Analytics (optional)**: PostHog / Plausible / GA4
- **Jobs (optional)**: Upstash Redis / QStash / BullMQ

---

## Integrations / APIs you typically need

### Payments
- Stripe (checkout/payment intents, refunds, webhooks)

### Shipping
- Shippo / EasyPost (rates, labels, tracking)
- Or direct carrier APIs (DHL/UPS/etc.)

### Taxes
- Stripe Tax / TaxJar / Avalara (depending on region)

### Email
- Transactional email provider for account and order emails

### Supplier Data
- Official supplier APIs (preferred) or supplier CSV feeds
- Your app should treat suppliers as **connectors** to avoid lock-in

---

## Security & Compliance

- Do not commit secrets. Use `.env.local` and deployment secrets (Vercel).
- Password hashing (bcrypt/argon2), secure cookies, HTTPS-only
- Rate limiting on auth + checkout endpoints
- Webhook signature verification and idempotency
- GDPR basics: privacy policy, cookie consent (if tracking), data export/delete flow
- Audit logs for admin actions

---

## Project Structure (example)

- `app/` pages, layouts, server actions
- `components/` UI components
- `lib/` integrations (stripe, email, shipping, suppliers)
- `prisma/` schema and migrations
- `jobs/` background tasks (sync inventory, send emails)
- `docs/` diagrams, policies, architecture notes

---

## Environment Variables

Create `.env.local` (never commit it). Keep `.env.example` committed.

Example:
- `DATABASE_URL=`
- `AUTH_SECRET=`
- `PUBLIC_APP_URL=`
- `STRIPE_SECRET_KEY=`
- `STRIPE_WEBHOOK_SECRET=`
- `EMAIL_PROVIDER_API_KEY=`
- `S3_ACCESS_KEY=`
- `S3_SECRET_KEY=`
- `S3_BUCKET=`
- `S3_ENDPOINT=`
- `SHIPPING_API_KEY=`
- `TAX_API_KEY=` (optional)
- `SEARCH_API_KEY=` (optional)

---

## Local Development

1. Install dependencies  
   `npm install`

2. Start Postgres (optional Docker)  
   `docker compose up -d`

3. Run migrations  
   `npx prisma migrate dev`

4. Start dev server  
   `npm run dev`

---

## Deployment

- Recommended: Vercel + managed Postgres (Neon / Supabase / Railway)
- Set environment variables in deployment settings
- Configure Stripe webhook endpoint:
  - `/api/webhooks/stripe`

---

## Roadmap

- **v1**: Auth, catalog, cart, checkout, orders, admin basics
- **v1.1**: Supplier connectors, inventory sync, shipping labels
- **v1.2**: Returns/refunds portal, reviews, analytics, search upgrade
- **v2**: Multi-currency, multi-language, advanced promotions, marketplace mode
