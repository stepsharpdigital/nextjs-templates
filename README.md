<div align="center">

# Branch 3 — Auth + Organizations

### Everything from branch1-auth-core, plus a complete organization management system.

Multi-org support · Member invitations · Role-based access control · B2B-ready<br/>
**Clone it. Configure it. Ship it.**

![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)
![Better Auth](https://img.shields.io/badge/Better_Auth-Organizations-black?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)

</div>

---

## What You Get

> Everything from `branch1-auth-core`, extended with a full organization management layer.

| Feature | What's Inside |
|---|---|
| **Auth Core** | Everything from `branch1-auth-core` — email auth, Google OAuth, protected routes |
| **Organizations** | Create organizations, multi-org support with switching |
| **Invitations** | Invite members by email, accept invite and join organization |
| **Roles** | Role-based access control — OWNER, ADMIN, MEMBER |
| **Management** | Organization settings and member management pages |
| **Email Delivery** | Resend integration — invitation emails |
| **Database** | PostgreSQL + Drizzle ORM — orgs, members, invitations tables |
| **Validation** | Zod + React Hook Form — strict, type-safe forms |
| **UI** | Shadcn/ui — accessible, consistent component system |
| **API** | Mobile-ready API endpoints throughout |

---

## Prerequisites

Before running this project, ensure you have:

- Node.js (v18+ recommended)
- PostgreSQL database (local or hosted — [Neon](https://neon.tech) free tier works great)
- A [Resend](https://resend.com) account (for email delivery)
- A Google OAuth application (for Google login)

---

## Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/stepsharpdigital/nextjs-templates.git
cd nextjs-templates
git checkout branch3-auth-organizations
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

**Better Auth organization plugin** — add the plugin to your auth config in `auth.ts`:

```ts
import { betterAuth } from "better-auth"
import { organization } from "better-auth/plugins"

export const auth = betterAuth({
    plugins: [
        organization() // enables organization management
    ]
})
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
```

**Important notes:**

- `DATABASE_URL` must point to your PostgreSQL database.
- `NEXT_PUBLIC_APP_URL` should be your app's URL — it is used to generate invitation acceptance links.
- `BETTER_AUTH_SECRET` should be a secure random string.
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

Copy the generated `auth-schema.ts` content into your `schema.ts` file. This branch includes additional tables for organizations, members, and invitations.

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

### 9. Setup Resend (Email Provider)

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

### 10. Shadcn/ui Setup (If Needed)

If initializing manually:

```bash
npx shadcn@latest init
```

Ensure required components are installed: `button`, `form`, `input`, `card`, `badge`, `dialog`, `dropdown-menu`, etc.

---

### 11. Run the Development Server

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
| **Protected** | `/org/create` |
| **Protected** | `/org/[slug]/settings` |
| **Protected** | `/org/[slug]/members` |
| **Protected** | `/org/[slug]/invite` |

Unauthenticated users are automatically redirected to `/login`.

---

## Role-Based Access Control

Each organization member is assigned one of the following roles:

| Role | Permissions |
|---|---|
| `OWNER` | Full access — manage members, settings, and delete the organization |
| `ADMIN` | Can invite members and manage organization settings |
| `MEMBER` | Standard access — cannot manage members or settings |

Role-based restrictions are enforced on both the frontend and API level.

---

## Organization Flow

1. A user creates an organization via `/org/create`
2. The creator is automatically assigned the `OWNER` role
3. The owner or admin can invite members by email via `/org/[slug]/invite`
4. Invited users receive an email with an acceptance link
5. Invited users accept the invite via `/api/accept-invitation/token...` and join the organization
6. Users belonging to multiple organizations can switch between them
7. Organization settings and member management are available via `/org/[slug]/settings` and `/org/[slug]/members`

---

## Tech Stack

| Tech | Purpose |
|---|---|
| [Next.js](https://nextjs.org) | App Router, Server Components, API Routes |
| [TypeScript](https://www.typescriptlang.org) | Strict mode, end-to-end type safety |
| [PostgreSQL](https://www.postgresql.org) | Primary database |
| [Drizzle ORM](https://orm.drizzle.team) | Type-safe queries, migrations |
| [Better Auth](https://better-auth.com) | OAuth, sessions, organization plugin |
| [Resend](https://resend.com) | Transactional & invitation email delivery |
| [Shadcn/ui](https://ui.shadcn.com) | Accessible, customizable components |
| [Zod](https://zod.dev) | Schema validation |
| [React Hook Form](https://react-hook-form.com) | Performant, type-safe forms |

---

## Production Deployment Notes

Before deploying, make sure to:

- Update `BASE_URL`, `NEXT_PUBLIC_APP_URL`, and `BETTER_AUTH_URL` to your production domain
- Update Google OAuth callback to your production URL
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

If any of the above fails, verify:

- Environment variables are correctly set
- Database migrations have been applied
- Resend API key is valid and the sending email is verified
- OAuth configuration is complete
- Invitation token is valid and has not expired

---

<div align="center">

Made by [Step Sharp Digital](https://github.com/stepsharpdigital)

### ⭐ Star this repo if it helped you.

</div>