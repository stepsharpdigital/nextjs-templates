# Branch 2 - Auth + Stripe Subscription (branch2-auth-stripe)

This branch extends `branch1-auth-core` with a complete Stripe subscription system. It includes everything from the authentication core plus individual user-based subscription management, Stripe Checkout, webhook syncing, and a billing portal.

It is designed to be production-ready and reusable for individual-user SaaS applications.

## Features

- Everything from `branch1-auth-core`
- Stripe Checkout for subscription payments
- Stripe customer creation and storage in database
- Subscription status syncing via Stripe webhooks
- Billing page showing current plan and status
- Stripe customer portal integration (manage/cancel subscription)

## Tech Stack

- Next.js (App Router)
- TypeScript
- PostgreSQL
- Drizzle ORM
- better-auth
- shadcn/ui
- Stripe
- Resend (email delivery)
- Zod
- React Hook Form

## Prerequisites

Before running this project, ensure you have:

- Node.js (v18+ recommended)
- PostgreSQL database (local or hosted)
- A Resend account (for email)
- A Google OAuth application (for Google login)
- A Stripe account (for payments)
- Stripe CLI (for local webhook testing)

## 1. Clone the Repository
```bash
git clone https://github.com/talhasultan-dev/nextjs-templates.git
```

Move to the cloned directory:
```bash
cd nextjs-templates
```

Switch to branch2:
```bash
git checkout branch2-auth-stripe
```

## 2. Install Dependencies
```bash
npm install
```

### Core packages (if starting from scratch):
```bash
npm install better-auth
npm install resend
npm install zod react-hook-form
npm install @hookform/resolvers
npm install @better-auth/stripe
```
### As we will be using Stripe with better Auth, better Auth helps us in the setup and configurations
Install the plugin:
```bash
npm install @better-auth/stripe
```
Next, install the Stripe SDK on your server:
```bash
npm install @better-auth/stripe
```
### Drizzle with Neon Postgres:
```bash
npm i drizzle-orm
npm i -D drizzle-kit
npm i @neondatabase/serverless
npm i dotenv
```

## 3. Environment Variables

A `.env.example` file is provided. Create your `.env` file and fill in all required variables.
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
STRIPE_WEBHOOK_SECRET=
STRIPE_SECRET_KEY=

# Add the price id's of your products (you can find them on stripe in products section)
STRIPE_PRO_PRICE_ID=
STRIPE_BASIC_PRICE_ID=

```

### Important Notes

- `DATABASE_URL` must point to your PostgreSQL database.
- `BETTER_AUTH_SECRET` should be a secure random string.
- `STRIPE_SECRET_KEY` is found in your Stripe dashboard.
- `STRIPE_PRICE_ID` (not used as env variable) is the ID of the subscription price you create in Stripe, e.g. ``STRIPE_PRO_PRICE_ID`` and ``STRIPE_BASIC_PRICE_ID`` are the 2 price Id's created and used in this project.
- `STRIPE_WEBHOOK_SECRET` is generated when you configure a webhook endpoint (see step 8).
- `RESEND_EMAIL` must be a verified email in Resend. If not verified, use `onboarding@resend.dev`.
- Google OAuth callback URL must match:
```bash
http://localhost:3000/api/auth/callback/google
```

The application will not run correctly unless all required variables are set.

## 4. Setup PostgreSQL Database

Create a PostgreSQL database, copy the connection string, and update `DATABASE_URL` accordingly.

## 5. Drizzle Configuration

Ensure `drizzle.config.ts` exists and references the correct PostgreSQL driver, schema path, and database URL.

## 6. Generate Database Migrations

Generate the schema required by better-auth:
```bash
npx @better-auth/cli@latest generate
```

Copy the generated `auth-schema.ts` content into your `schema.ts` file. This branch also includes additional tables for Stripe customers and subscriptions.

## 7. Run Migrations
```bash
npx drizzle-kit push
```

Or if using migrate:
```bash
npx drizzle-kit migrate
```

### This will create:

- `account` table
-  `session` table
- `subscriptions` table
- `user` table
- `verification` table


The app will fail if migrations are not applied.

## 8. Setup Stripe

### Create a Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account.
2. Navigate to the Stripe Dashboard.

### Get API Keys

1. Go to **Developers > API keys**.
2. Copy your **Secret key**.
3. Add it to `.env`:
```bash
STRIPE_SECRET_KEY=your_secret_key 
```

### Create a Product and Price

1. Go to **Products** in the Stripe Dashboard.
2. Create a new product with a recurring price (monthly or yearly).
3. Copy the **Price ID** (starts with `price_`).
4. Add it to `.env`:
```bash
STRIPE_PRICE_ID=price_xxxxxxxxxxxxxxxx
```

### Setup Webhooks

Stripe webhooks are required to sync subscription status changes to your database.

#### For Local development, use the Stripe CLI:

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

#### For Production:

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

## 9. Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create OAuth credentials.
3. Add the authorized redirect URI:
```bash
http://localhost:3000/api/auth/callback/google
```

4. Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` and paste them into `.env`.

## 10. Setup Resend (Email Provider)

1. Create a [Resend](https://resend.com) account.
2. Verify a sending domain or email address.
3. Generate an API key.
4. Add to `.env`:
```bash
RESEND_API_KEY=your_key
RESEND_EMAIL=your_verified_email
```

If you do not have a verified email, use the officially provided address:
```bash
RESEND_EMAIL=onboarding@resend.dev
```

Note: `onboarding@resend.dev` only allows sending emails to yourself.

## 11. shadcn/ui Setup (If Needed)

If initializing manually:
```bash
npx shadcn@latest init
```

Ensure required components are installed (button, form, input, card, badge, etc.).

## 12. Run the Development Server
```bash
npm run dev
```

Application runs at:
```
http://localhost:3000/
```

## Application Routes

### Public

- `/signup`
- `/login`
- `/forgot-password`
- `/reset-password?token=...`

### Protected

- `/dashboard`
- `/billing`

Unauthenticated users are automatically redirected to `/login`.

## Billing Page (`/billing`)

The billing page allows logged-in users to:

- View their current subscription plan and status
- Subscribe or upgrade via Stripe Checkout
- Access the Stripe customer portal to manage or cancel their subscription

## Subscription Statuses

The following statuses are tracked and stored in the database via Stripe webhooks:

- `active`
- `trialing`
- `past_due`
- `canceled`
- `incomplete`

## Production Deployment Notes

Before deploying:

- Update `BASE_URL` and `BETTER_AUTH_URL` to your production domain
- Update Google OAuth callback to the production URL
- Register a production Stripe webhook endpoint and update `STRIPE_WEBHOOK_SECRET`
- Ensure PostgreSQL is accessible from your hosting environment
- Ensure Resend domain is verified, or use `onboarding@resend.dev`
- Set a strong `BETTER_AUTH_SECRET`

## Expected Working Flow

After correct setup:

- User can sign up and log in
- Google login works
- Forgot/reset password works
- Protected routes redirect unauthenticated users to `/login`
- Logged-in user can subscribe via Stripe Checkout
- Stripe webhooks update subscription status in the database
- User can manage their billing via the Stripe portal

### If any of the above fails, verify:

- Environment variables are correctly set
- Database migrations have been applied
- Stripe webhook is correctly configured and the secret matches
- Stripe is listening for events
- Stripe Price ID is correct and the product is active
- OAuth and email provider configurations are complete