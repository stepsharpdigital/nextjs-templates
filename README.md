# Branch 4 - Org Subscription Per Member (branch4-org-subs-per-member)

This branch extends `branch3-auth-organizations` with a complete organization-level Stripe subscription system. It includes everything from the organizations branch plus per-member billing, automatic Stripe quantity syncing, and an organization billing portal.

It is designed to be production-ready and reusable for scalable team-based SaaS platforms with usage-based billing.

## Features

- Everything from `branch3-auth-organizations`
- Stripe subscription tied to the organization, not the individual user
- Per-member billing model
- Automatic Stripe quantity syncing when members are added or removed
- Organization billing page with current plan and status
- Stripe customer portal for organizations
- Subscription-based feature restriction

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

Switch to branch4:
```bash
git checkout branch4-org-subs-per-member
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
```

### As we will be using Stripe with better Auth, better Auth helps us in the setup and configurations
Install the plugin:
```bash
npm install @better-auth/stripe
```
Next, install the Stripe SDK on your server:
```bash
npm install stripe@^20.0.0
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

# Add the price id's of your products (you can find them on stripe in products section) we have used these 3 products in this project.
STRIPE_STARTER_PRICE_ID=
STRIPE_TEAM_PRICE_ID=
STRIPE_BUSINESS_PRICE_ID=

```

### Important Notes

- `DATABASE_URL` must point to your PostgreSQL database.
- `NEXT_PUBLIC_APP_URL` is used to generate invitation acceptance links and must be set correctly.
- `BETTER_AUTH_SECRET` should be a secure random string.
- `RESEND_EMAIL` must be a verified email in Resend. If not verified, use `onboarding@resend.dev`.
- `STRIPE_SECRET_KEY` is found in your Stripe dashboard under **Developers > API keys**.
- `STRIPE_STARTER_PRICE_ID`,`STRIPE_TEAM_PRICE_ID` and `STRIPE_BUSINESS_PRICE_ID` are the price ID's of your product in Stripe (starts with `price_`).
- `STRIPE_WEBHOOK_SECRET` is generated when you configure a webhook endpoint (see step 9).
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

Copy the generated `auth-schema.ts` content into your `schema.ts` file. This branch includes additional tables for organization Stripe customers and subscriptions.

## 7. Run Migrations
```bash
npx drizzle-kit push
```

Or if using migrate:
```bash
npx drizzle-kit migrate
```

### This will create:

- `user` table
- `account` table
- `session` table
- `verification` table
- `organization` table
- `member` table
- `invitation` table
- `subscriptions` table

The app will fail if migrations are not applied.

## 8. Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create OAuth credentials.
3. Add the authorized redirect URI:
```bash
http://localhost:3000/api/auth/callback/google
```

4. Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` and paste them into `.env`.

## 9. Setup Stripe

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
3. Choose Flat-rate as it has the /unit or /seat pricing feature.
4. Copy the **Price ID** (starts with `price_`).
5. Add it to `.env`:
```bash
STRIPE_TEAM_PRICE_ID=price_xxxxxxxxxxxxxxxx
```

### Setup Webhooks

Stripe webhooks are required to sync subscription status changes to your database. Member count changes also trigger Stripe quantity updates through these webhooks.

#### For local development, use the Stripe CLI:

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

#### For production:

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

## 10. Setup Resend (Email Provider)

Resend is used to send organization invitation emails.

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

Ensure required components are installed (button, form, input, card, badge, dialog, dropdown-menu, etc.).

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
- `/org/create`
- `/org/[slug]/settings`
- `/org/[slug]/members`
- `/org/[slug]/invite`
- `/org/[slug]/billing`
- `/org/[slug]/subs` Only accessible if the subscription is active.

Unauthenticated users are automatically redirected to `/login`.

## Role-Based Access Control

Each organization member is assigned one of the following roles:

- `OWNER` - Full access. Can manage members, settings, billing, and delete the organization.
- `ADMIN` - Can invite members and manage organization settings.
- `MEMBER` - Standard access. Cannot manage members, settings, or billing.

Role-based restrictions are enforced on both the frontend and API level.

## Per-Member Billing Model

The subscription belongs to the organization, not the individual user. Stripe subscription quantity is kept in sync with the organization member count automatically (if the /member plans are subscribed):

- When a new member accepts an invitation and joins, the Stripe subscription quantity is increased by 1.
- When a member is removed from the organization, the Stripe subscription quantity is decreased by 1.

This ensures billing always reflects the actual number of active members.

## Organization Billing Flow

- The organization owner navigates to `/org/[slug]/billing`
- The owner initiates a subscription via Stripe Checkout
- On successful checkout, a Stripe customer and subscription are created and stored in the database
- The subscription quantity is set to the current member count at the time of checkout
- As members join or leave, the quantity is updated automatically
- The owner can access the Stripe customer portal to manage or cancel the subscription
- If the subscription is inactive or canceled, organization features can be restricted

## Production Deployment Notes

Before deploying:

- Update `BASE_URL`, `NEXT_PUBLIC_APP_URL`, and `BETTER_AUTH_URL` to your production domain
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
- User can create an organization
- Owner or admin can invite members by email
- Invited members receive an email and can accept the invitation
- Role-based access is enforced across organization pages
- Users in multiple organizations can switch between them
- Organization owner can subscribe via Stripe Checkout
- Stripe subscription quantity updates automatically as members join or leave if the /member plan is subscribed.
- Owner can manage billing via the Stripe customer portal
- Organization features are restricted if the subscription is inactive (they can't accesss the org/[slug]/subs page)

### If any of the above fails, verify:

- Environment variables are correctly set
- Database migrations have been applied
- Stripe webhook is correctly configured and the secret matches
- Stripe is listening for events
- Stripe Price ID is correct, the product is active, and per-unit pricing is enabled
- Resend API key is valid and the sending email is verified
- OAuth configuration is complete
- Invitation token is valid and has not expired