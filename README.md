<div align="center">

# Branch 1 — Authentication Core

### A complete, production-ready authentication foundation for SaaS applications.

Next.js App Router · Better Auth · PostgreSQL · Drizzle ORM · Resend<br/>
**Clone it. Configure it. Ship it.**

![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)
![Better Auth](https://img.shields.io/badge/Better_Auth-Sessions-black?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)

</div>

---

## What You Get

> A complete auth foundation — designed to be reused across every future SaaS project.

| Feature | What's Inside |
|---|---|
| **Email Auth** | Signup, login, forgot password, token-based reset |
| **OAuth** | Google login via Better Auth |
| **Protected Routes** | Automatic redirect to `/login` for unauthenticated users |
| **Dashboard** | Example protected `/dashboard` page |
| **Email Delivery** | Resend integration — password reset emails |
| **Database** | PostgreSQL + Drizzle ORM — typed queries, migrations |
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
git checkout branch1-auth-core
```

---

### 2. Install Dependencies

```bash
npm install
```

If starting from scratch or verifying packages, ensure the following are installed:

```bash
npm install better-auth
npm install resend
npm install zod react-hook-form
npm install @hookform/resolvers
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
```

**Important notes:**

- `DATABASE_URL` must point to your PostgreSQL database.
- Google OAuth callback URL must match: `http://localhost:3000/api/auth/callback/google`
- `BETTER_AUTH_SECRET` should be a secure random string.
- `RESEND_EMAIL` must be a verified address inside Resend.

> The application will not run correctly unless all required variables are set.

---

### 4. Setup PostgreSQL Database

Create a PostgreSQL database, copy your connection string, and update `DATABASE_URL` accordingly.

---

### 5. Drizzle Configuration

Ensure `drizzle.config.ts` exists and references:

- PostgreSQL driver
- Correct schema path
- Correct database URL

---

### 6. Generate Database Migrations

To generate the schema required by Better Auth, run:

```bash
npx @better-auth/cli@latest generate
```

This generates `auth-schema.ts` containing the schema required by Better Auth. Copy and paste it into the `schema.ts` file already created in the project.

---

### 7. Run Migrations

```bash
npx drizzle-kit push
```

Or if using migrate:

```bash
npx drizzle-kit migrate
```

This will create the `users` table and all Better Auth required tables.

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

1. Create a [Resend](https://resend.com) account.
2. Verify a sending domain or email.
3. Generate an API key.
4. Add to `.env`:

```bash
RESEND_API_KEY=your_key
RESEND_EMAIL=your_verified_email
```

> If you don't have a verified email yet, you can use `onboarding@resend.dev` — Resend's officially provided address that allows you to send emails to yourself.

---

### 10. Shadcn/ui Setup (If Needed)

If initializing manually:

```bash
npx shadcn@latest init
```

Ensure required components are installed: `button`, `form`, `input`, `card`, etc.

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

Unauthenticated users are automatically redirected to `/login`.

---

## Tech Stack

| Tech | Purpose |
|---|---|
| [Next.js](https://nextjs.org) | App Router, Server Components, API Routes |
| [TypeScript](https://www.typescriptlang.org) | Strict mode, end-to-end type safety |
| [PostgreSQL](https://www.postgresql.org) | Primary database |
| [Drizzle ORM](https://orm.drizzle.team) | Type-safe queries, migrations |
| [Better Auth](https://better-auth.com) | OAuth, sessions, protected routes |
| [Resend](https://resend.com) | Transactional email delivery |
| [Shadcn/ui](https://ui.shadcn.com) | Accessible, customizable components |
| [Zod](https://zod.dev) | Schema validation |
| [React Hook Form](https://react-hook-form.com) | Performant, type-safe forms |

---

## Production Deployment Notes

Before deploying, make sure to:

- Update `BASE_URL`
- Update `BETTER_AUTH_URL`
- Update Google OAuth callback to your production URL
- Ensure PostgreSQL is accessible from your host
- Ensure Resend domain is verified (or use `onboarding@resend.dev`)
- Set a strong `BETTER_AUTH_SECRET`

---

## Expected Working Flow

After correct setup, the following should all work:

- User can sign up
- User can log in
- Google login works
- Forgot password sends a reset email
- Reset password updates credentials
- Protected routes redirect unauthenticated users properly

If any of the above fails, verify your environment variables, database migrations, OAuth configuration, and email provider setup.

---

<div align="center">

Made by [Step Sharp Digital](https://github.com/stepsharpdigital)

**Star this repo if it helped you.**

</div>