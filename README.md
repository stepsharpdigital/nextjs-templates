<div align="center">

# Branch 2 — Auth + Stripe Subscriptions

### Everything from branch1-auth-core, plus a complete Stripe subscription system.

Stripe Checkout · Webhook syncing · Customer portal · Individual-user billing<br/>
**Clone it. Configure it. Ship it.**

![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)

</div>

---

## What You Get

> Everything from `branch1-auth-core`, extended with a full Stripe subscription layer.

| Feature | What's Inside |
|---|---|
| **Auth Core** | Everything from `branch1-auth-core` — email auth, Google OAuth, protected routes |
| **Stripe Checkout** | Subscription payments via Stripe Checkout |
| **Customer Storage** | Stripe customer creation and storage in database |
| **Webhook Syncing** | Subscription status syncing via Stripe webhooks |
| **Billing Page** | View current plan and status at `/billing` |
| **Customer Portal** | Manage or cancel subscription via Stripe portal |
| **Email Delivery** | Resend integration — transactional emails |
| **Database** | PostgreSQL + Drizzle ORM — customers and subscriptions tables |
| **Validation** | Zod + React Hook Form — strict, type-safe forms |
| **UI** | Shadcn/ui — accessible, consistent component system |

---

## Prerequisites

Before running this project, ensure you have:

- Node.js (v18+ recommended)
- PostgreSQL database (local or hosted — [Neon](https://neon.tech) free tier works great)
- A [Resend](https://resend.com) account (for email delivery)
- A Google OAuth application (for Google login)
- A [Stripe](https://stripe.com) account (for payments)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (for local webhook testing)

---

## Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/stepsharpdigital/nextjs-templates.git
cd nextjs-templates
git checkout branch2-auth-stripe
```

---

### 2. Install Dependencies

```bash
npm install
```

**Core packages (if starting from scratch):**

```bash
npm install better-auth
npm install resend
npm install zod react-hook-form
npm install @hookform/resolvers
```

**Better Auth Stripe plugin** — Better Auth handles Stripe setup and configuration. Install the plugin:

```bash
npm install @better-auth/stripe
```

Then install the Stripe SDK on your server:

```bash
npm install stripe
```

**Drizzle with Neon Postgres:**

```bash
npm i drizzle-orm
npm i -D drizzle-kit
npm i @neondatabase/serverless
npm i dotenv
```

---

### 3. Environment Variables

A `.env.example` file is provided. Create your `.env` file and fill in all required variables:

```bash
# App
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

# Database
DATABASE_URL=

# Base URL of the app
BASE_URL=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Resend
RESEND_API_KEY=
RESEND_EMAIL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Add the price IDs of your products (found in Stripe dashboard under Products)
STRIPE_PRO_PRICE_ID=
STRIPE_BASIC_PRICE_ID=
```

**Important notes:**

- `DATABASE_URL` must point to your PostgreSQL database.
- `BETTER_AUTH_SECRET` should be a secure random string.
- `STRIPE_SECRET_KEY` is found in your Stripe dashboard under **Developers > API keys**.
- `STRIPE_PRO_PRICE_ID` and `STRIPE_BASIC_PRICE_ID` are the Price IDs of the two subscription products created in Stripe (starts with `price_`).
- `STRIPE_WEBHOOK_SECRET` is generated when you configure a webhook endpoint (see Step 8).
- `RESEND_EMAIL` must be a verified address in Resend. If not verified, use `onboarding@resend.dev`.
- Google OAuth callback URL must match: `http://localhost:3000/api/auth/callback/google`

> The application will not run correctly unless all required variables are set.

---

### 4. Setup PostgreSQL Database

Create a PostgreSQL database, copy your connection string, and update `DATABASE_URL` accordingly.

---

### 5. Drizzle Configuration

Ensure `drizzle.config.ts` exists and references the correct PostgreSQL driver, schema path, and database URL.

---

### 6. Generate Database Migrations

Generate the schema required by Better Auth:

```bash
npx @better-auth/cli@latest generate
```

Copy the generated `auth-schema.ts` content into your `schema.ts` file. This branch also includes additional tables for Stripe customers and subscriptions.

---

### 7. Run Migrations

```bash
npx drizzle-kit push
```

Or if using migrate:

```bash
npx drizzle-kit migrate
```

This will create the following tables:

| Table | Purpose |
|---|---|
| `user` | User accounts |
| `account` | OAuth account links |
| `session` | Active sessions |
| `verification` | Email verification tokens |
| `subscriptions` | Stripe subscription records |

> ⚠️ The app will fail if migrations are not applied.

---

### 8. Setup Stripe

**Create a Stripe Account**

1. Go to [stripe.com](https://stripe.com) and create an account.
2. Navigate to the Stripe Dashboard.

**Get API Keys**

1. Go to **Developers > API keys**.
2. Copy your **Secret key** and add it to `.env`:

```bash
STRIPE_SECRET_KEY=your_secret_key
```

**Create a Product and Price**

1. Go to **Products** in the Stripe Dashboard.
2. Create a new product with a recurring price (monthly or yearly).
3. Copy the **Price ID** (starts with `price_`) and add it to `.env`:

```bash
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxxxxx
STRIPE_BASIC_PRICE_ID=price_xxxxxxxxxxxxxxxx
```

**Setup Webhooks — Local Development**

Stripe webhooks are required to sync subscription status changes to your database.

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli).
2. Login:

```bash
stripe login
```

3. Forward events to your local server:

```bash
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook
```

4. Copy the webhook signing secret from the CLI output and add it to `.env`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
```

**Setup Webhooks — Production**

1. Go to **Developers > Webhooks** in the Stripe Dashboard.
2. Add an endpoint pointing to your production URL:

```bash
https://yourdomain.com/api/webhooks/stripe
```

3. Select the following events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. Copy the signing secret and update `STRIPE_WEBHOOK_SECRET` in your production environment.

---

### 9. Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Create OAuth credentials.
3. Add authorized redirect URI:

```bash
http://localhost:3000/api/auth/callback/google
```

4. Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` into your `.env`.

---

### 10. Setup Resend (Email Provider)

1. Create a [Resend](https://resend.com) account.
2. Verify a sending domain or email address.
3. Generate an API key.
4. Add to `.env`:

```bash
RESEND_API_KEY=your_key
RESEND_EMAIL=your_verified_email
```

> If you don't have a verified email yet, use `onboarding@resend.dev` — Resend's officially provided address. Note: it only allows sending emails to yourself.

---

### 11. Shadcn/ui Setup (If Needed)

If initializing manually:

```bash
npx shadcn@latest init
```

Ensure required components are installed: `button`, `form`, `input`, `card`, `badge`, etc.

---

### 12. Run the Development Server

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000) — you're live.

---

## Application Routes

| Type | Route |
|---|---|
| **Public** | `/signup` |
| **Public** | `/login` |
| **Public** | `/forgot-password` |
| **Public** | `/reset-password?token=...` |
| **Protected** | `/dashboard` |
| **Protected** | `/billing` |

Unauthenticated users are automatically redirected to `/login`.

---

## Billing Page (`/billing`)

The billing page allows logged-in users to:

- View their current subscription plan and status
- Subscribe or upgrade via Stripe Checkout
- Access the Stripe customer portal to manage or cancel their subscription

---

## Subscription Statuses

The following statuses are tracked and stored in the database via Stripe webhooks:

| Status | Description |
|---|---|
| `active` | Subscription is active and paid |
| `trialing` | User is in a free trial period |
| `past_due` | Payment failed, subscription at risk |
| `canceled` | Subscription has been canceled |
| `incomplete` | Checkout was not completed |

---

## Tech Stack

| Tech | Purpose |
|---|---|
| [Next.js](https://nextjs.org) | App Router, Server Components, API Routes |
| [TypeScript](https://www.typescriptlang.org) | Strict mode, end-to-end type safety |
| [PostgreSQL](https://www.postgresql.org) | Primary database |
| [Drizzle ORM](https://orm.drizzle.team) | Type-safe queries, migrations |
| [Better Auth](https://better-auth.com) | OAuth, sessions, Stripe plugin |
| [Stripe](https://stripe.com) | Payments, subscriptions, webhooks, portal |
| [Resend](https://resend.com) | Transactional email delivery |
| [Shadcn/ui](https://ui.shadcn.com) | Accessible, customizable components |
| [Zod](https://zod.dev) | Schema validation |
| [React Hook Form](https://react-hook-form.com) | Performant, type-safe forms |

---

## Production Deployment Notes

Before deploying, make sure to:

- Update `BASE_URL` and `BETTER_AUTH_URL` to your production domain
- Update Google OAuth callback to your production URL
- Register a production Stripe webhook endpoint and update `STRIPE_WEBHOOK_SECRET`
- Ensure PostgreSQL is accessible from your hosting environment
- Ensure Resend domain is verified (or use `onboarding@resend.dev`)
- Set a strong `BETTER_AUTH_SECRET`

---

## Expected Working Flow

After correct setup, the following should all work:

- User can sign up and log in
- Google login works
- Forgot/reset password works
- Protected routes redirect unauthenticated users to `/login`
- Logged-in user can subscribe via Stripe Checkout
- Stripe webhooks update subscription status in the database
- User can manage their billing via the Stripe portal

If any of the above fails, verify:

- Environment variables are correctly set
- Database migrations have been applied
- Stripe webhook is correctly configured and the secret matches
- Stripe CLI is running and listening for events
- Stripe Price IDs are correct and the products are active
- OAuth and email provider configurations are complete

---

<div align="center">

Made by [StepSharp Digital](https://github.com/stepsharpdigital)

### ⭐ Star this repo if it helped you.

</div>