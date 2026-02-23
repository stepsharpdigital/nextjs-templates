<div align="center">

# Branch 4 — Org Subscriptions Per Member

### Everything from branch3-auth-organizations, plus organization-level Stripe billing.

Per-member pricing · Auto quantity syncing · Org billing portal · Usage-based billing<br/>
**Clone it. Configure it. Ship it.**

![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)

</div>

---

## What You Get

> Everything from `branch3-auth-organizations`, extended with organization-level Stripe billing.

| Feature | What's Inside |
|---|---|
| **Auth + Orgs Core** | Everything from `branch3-auth-organizations` — auth, OAuth, organizations, roles, invitations |
| **Org Subscriptions** | Stripe subscription tied to the organization, not the individual user |
| **Per-Member Billing** | Subscription quantity automatically reflects active member count |
| **Auto Quantity Sync** | Stripe quantity increases/decreases as members join or leave |
| **Org Billing Page** | View current plan and status at `/org/[slug]/billing` |
| **Customer Portal** | Organization owner can manage or cancel via Stripe portal |
| **Feature Restriction** | Subscription-based access restriction for organization features |
| **Email Delivery** | Resend integration — invitation and transactional emails |
| **Database** | PostgreSQL + Drizzle ORM — orgs, members, invitations, subscriptions tables |
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
git checkout branch4-org-subs-per-member
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
npm install stripe@^20.0.0
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
NEXT_PUBLIC_APP_URL=

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
EMAIL_SENDER_NAME=
EMAIL_SENDER_ADDRESS=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Add the price IDs of your products (found in Stripe dashboard under Products)
STRIPE_STARTER_PRICE_ID=
STRIPE_TEAM_PRICE_ID=
STRIPE_BUSINESS_PRICE_ID=
```

**Important notes:**

- `DATABASE_URL` must point to your PostgreSQL database.
- `NEXT_PUBLIC_APP_URL` is used to generate invitation acceptance links and must be set correctly.
- `BETTER_AUTH_SECRET` should be a secure random string.
- `RESEND_EMAIL` must be a verified address in Resend. If not verified, use `onboarding@resend.dev`.
- `STRIPE_SECRET_KEY` is found in your Stripe dashboard under **Developers > API keys**.
- `STRIPE_STARTER_PRICE_ID`, `STRIPE_TEAM_PRICE_ID`, and `STRIPE_BUSINESS_PRICE_ID` are the Price IDs of your products in Stripe (starts with `price_`).
- `STRIPE_WEBHOOK_SECRET` is generated when you configure a webhook endpoint (see Step 9).
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

Copy the generated `auth-schema.ts` content into your `schema.ts` file. This branch includes additional tables for organization Stripe customers and subscriptions.

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
| `organization` | Organization records |
| `member` | Organization memberships |
| `invitation` | Pending invitations |
| `subscriptions` | Stripe subscription records per organization |

> ⚠️ The app will fail if migrations are not applied.

---

### 8. Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Create OAuth credentials.
3. Add authorized redirect URI:

```bash
http://localhost:3000/api/auth/callback/google
```

4. Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` into your `.env`.

---

### 9. Setup Stripe

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
3. Choose **Flat-rate** pricing — it includes the `/unit` or `/seat` pricing feature required for per-member billing.
4. Copy the **Price ID** (starts with `price_`) and add it to `.env`:

```bash
STRIPE_STARTER_PRICE_ID=price_xxxxxxxxxxxxxxxx
STRIPE_TEAM_PRICE_ID=price_xxxxxxxxxxxxxxxx
STRIPE_BUSINESS_PRICE_ID=price_xxxxxxxxxxxxxxxx
```

**Setup Webhooks — Local Development**

Stripe webhooks are required to sync subscription status changes to your database. Member count changes also trigger Stripe quantity updates through these webhooks.

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli).
2. Login:

```bash
stripe login
```

3. Forward events to your local server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
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

### 10. Setup Resend (Email Provider)

Resend is used to send organization invitation emails.

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

Ensure required components are installed: `button`, `form`, `input`, `card`, `badge`, `dialog`, `dropdown-menu`, etc.

---

### 12. Run the Development Server

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000) — you're live.

---

## Application Routes

| Type | Route | Notes |
|---|---|---|
| **Public** | `/signup` | |
| **Public** | `/login` | |
| **Public** | `/forgot-password` | |
| **Public** | `/reset-password?token=...` | |
| **Protected** | `/dashboard` | |
| **Protected** | `/org/create` | |
| **Protected** | `/org/[slug]/settings` | |
| **Protected** | `/org/[slug]/members` | |
| **Protected** | `/org/[slug]/invite` | |
| **Protected** | `/org/[slug]/billing` | |
| **Protected** | `/org/[slug]/subs` | Only accessible if subscription is active |

Unauthenticated users are automatically redirected to `/login`.

---

## Role-Based Access Control

Each organization member is assigned one of the following roles:

| Role | Permissions |
|---|---|
| `OWNER` | Full access — manage members, settings, billing, and delete the organization |
| `ADMIN` | Can invite members and manage organization settings |
| `MEMBER` | Standard access — cannot manage members, settings, or billing |

Role-based restrictions are enforced on both the frontend and API level.

---

## Per-Member Billing Model

The subscription belongs to the organization, not the individual user. Stripe subscription quantity is automatically kept in sync with the organization member count (when a per-member plan is subscribed):

- When a new member accepts an invitation and joins, the Stripe subscription quantity is **increased by 1**.
- When a member is removed from the organization, the Stripe subscription quantity is **decreased by 1**.

This ensures billing always reflects the actual number of active members.

---

## Organization Billing Flow

1. The organization owner navigates to `/org/[slug]/billing`
2. The owner initiates a subscription via Stripe Checkout
3. On successful checkout, a Stripe customer and subscription are created and stored in the database
4. The subscription quantity is set to the current member count at the time of checkout
5. As members join or leave, the quantity is updated automatically
6. The owner can access the Stripe customer portal to manage or cancel the subscription
7. If the subscription is inactive or canceled, organization features are restricted (the `/org/[slug]/subs` page becomes inaccessible)

---

## Tech Stack

| Tech | Purpose |
|---|---|
| [Next.js](https://nextjs.org) | App Router, Server Components, API Routes |
| [TypeScript](https://www.typescriptlang.org) | Strict mode, end-to-end type safety |
| [PostgreSQL](https://www.postgresql.org) | Primary database |
| [Drizzle ORM](https://orm.drizzle.team) | Type-safe queries, migrations |
| [Better Auth](https://better-auth.com) | OAuth, sessions, organization + Stripe plugin |
| [Stripe](https://stripe.com) | Payments, per-seat subscriptions, webhooks, portal |
| [Resend](https://resend.com) | Transactional & invitation email delivery |
| [Shadcn/ui](https://ui.shadcn.com) | Accessible, customizable components |
| [Zod](https://zod.dev) | Schema validation |
| [React Hook Form](https://react-hook-form.com) | Performant, type-safe forms |

---

## Production Deployment Notes

Before deploying, make sure to:

- Update `BASE_URL`, `NEXT_PUBLIC_APP_URL`, and `BETTER_AUTH_URL` to your production domain
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
- User can create an organization
- Owner or admin can invite members by email
- Invited members receive an email and can accept the invitation
- Role-based access is enforced across organization pages
- Users in multiple organizations can switch between them
- Organization owner can subscribe via Stripe Checkout
- Stripe subscription quantity updates automatically as members join or leave (when on a per-member plan)
- Owner can manage billing via the Stripe customer portal
- Organization features are restricted if the subscription is inactive (`/org/[slug]/subs` becomes inaccessible)

If any of the above fails, verify:

- Environment variables are correctly set
- Database migrations have been applied
- Stripe webhook is correctly configured and the secret matches
- Stripe CLI is running and listening for events
- Stripe Price IDs are correct, products are active, and per-unit pricing is enabled
- Resend API key is valid and the sending email is verified
- OAuth configuration is complete
- Invitation token is valid and has not expired

---

<div align="center">

Made by [StepSharp Digital](https://github.com/stepsharpdigital)

### ⭐ Star this repo if it helped you.

</div>