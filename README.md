# Branch 3 - Auth + Organizations (branch3-auth-organizations)

This branch extends `branch1-auth-core` with a complete organization management system. It includes everything from the authentication core plus organization creation, member invitations, role-based access control, and multi-organization support.

It is designed to be production-ready and reusable for B2B or team-based SaaS applications.

## Features

- Everything from `branch1-auth-core`
- Organization creation
- Invite members by email
- Accept invite and join organization
- Role-based access control (OWNER, ADMIN, MEMBER)
- Multi-organization support with organization switching
- Organization settings and member management pages

## Tech Stack

- Next.js (App Router)
- TypeScript
- PostgreSQL
- Drizzle ORM
- better-auth
- shadcn/ui
- Resend (email delivery)
- Zod
- React Hook Form

## Prerequisites

Before running this project, ensure you have:

- Node.js (v18+ recommended)
- PostgreSQL database (local or hosted)
- A Resend account (for email)
- A Google OAuth application (for Google login)

## 1. Clone the Repository
```bash
git clone https://github.com/talhasultan-dev/nextjs-templates.git
```

Move to the cloned directory:
```bash
cd nextjs-templates
```

Switch to branch3:
```bash
git checkout branch3-auth-organizations
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

### better-auth organization plugin:
Add the plugin to your auth config:
`auth.ts`
```bash
import { betterAuth } from "better-auth"
import { organization } from "better-auth/plugins"
export const auth = betterAuth({
    plugins: [ 
        organization() // enables organization management
    ] 
})
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

```

### Important Notes

- `DATABASE_URL` must point to your PostgreSQL database.
- `NEXT_PUBLIC_APP_URL` should be the URL as it is used to generate the invitation acceptation link.
- `BETTER_AUTH_SECRET` should be a secure random string.
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

Copy the generated `auth-schema.ts` content into your `schema.ts` file. This branch includes additional tables for organizations, members, and invitations.

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

The app will fail if migrations are not applied.

## 8. Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create OAuth credentials.
3. Add the authorized redirect URI:
```bash
http://localhost:3000/api/auth/callback/google
```

4. Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` and paste them into `.env`.

## 9. Setup Resend (Email Provider)

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

## 10. shadcn/ui Setup (If Needed)

If initializing manually:
```bash
npx shadcn@latest init
```

Ensure required components are installed (button, form, input, card, badge, dialog, dropdown-menu, etc.).

## 11. Run the Development Server
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

Unauthenticated users are automatically redirected to `/login`.

## Role-Based Access Control

Each organization member is assigned one of the following roles:

- `OWNER` - Full access. Can manage members, settings, and delete the organization.
- `ADMIN` - Can invite members and manage organization settings.
- `MEMBER` - Standard access. Cannot manage members or settings.

Role-based restrictions are enforced on both the frontend and API level.

## Organization Flow

- A user creates an organization via `/org/create`
- The creator is automatically assigned the `OWNER` role
- The owner or admin can invite members by email via `/org/[slug]/invite`
- Invited users receive an email with an acceptance link
- Invited users accept the invite via `/api/accept-invitation/token...` and join the organization
- Users belonging to multiple organizations can switch between them
- Organization settings and member management are available via `/org/[slug]/settings` and `/org/[slug]/members`

## Production Deployment Notes

Before deploying:

- Update `BASE_URL` , `NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_URL` to your production domain
- Update Google OAuth callback to the production URL
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

### If any of the above fails, verify:

- Environment variables are correctly set
- Database migrations have been applied
- Resend API key is valid and the sending email is verified
- OAuth configuration is complete
- Invitation token is valid and has not expired