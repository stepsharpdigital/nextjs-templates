# Branch 1 - Authentication Core (branch1-auth-core)

This branch provides a complete authentication foundation for SaaS applications using Next.js (App Router), better-auth, PostgreSQL (neon), and Drizzle ORM.

It is designed to be production-ready and reusable across future projects.


## Features

- Email + password signup
- Email + password login
- Forgot password (email reset link)
- Reset password (token-based)
- Google OAuth login
- Protected routes
- Example dashboard (/dashboard)
- Mobile-ready API endpoints
- PostgreSQL + Drizzle ORM integration
- Resend email integration
- Form validation with Zod
- Forms built using React Hook Form
- UI built with shadcn/ui


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

Switch to the branch-1-auth-core:
```bash
git checkout branch1-auth-core
```

## 2. Install Dependencies
```bash
npm install
```

### If starting from scratch or verifying packages, ensure the following are installed:
```bash
npm install better-auth
npm install resend
npm install zod react-hook-form
npm install @hookform/resolvers
```
### Drizzle with Neon Postgres
```bash
npm i drizzle-orm
npm i -D drizzle-kit
```
- You should also install the Neon serverless driver.
```bash
npm i @neondatabase/serverless
```
- You should have installed the dotenv package for managing environment variables.
```bash
npm i dotenv
```

## 3. Environment Variables

### A .env.example file is provided.

- Create your .env file
- Fill in all required variables.
Required Environment Variables

ENV structure (refer to .env.example):
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
### Important Notes

- ``DATABASE_URL`` must point to your PostgreSQL database.
- Google OAuth callback URL must match:
```bash
   http://localhost:3000/api/auth/callback/google
```
- ``AUTH_SECRET`` should be a secure random string.

- ``RESEND_EMAIL`` must be verified inside Resend.

 The application will not run correctly unless all required variables are set.


## 4. Setup PostgreSQL Database

Create a PostgreSQL database and copy your connection string and:

- Update ``DATABASE_URL`` accordingly

## 5. Drizzle Configuration

Ensure the Drizzle config file exists (usually drizzle.config.ts) and references:

- PostgreSQL driver

- Correct schema path

- Correct database URL

## 6. Generate Database Migrations

### After configuring the database:
To generate the schema required by Better Auth, run the following command:
```bash
npx @better-auth/cli@latest generate
```
- This generates auth-schema.ts where the schema required by better-auth is present you can copy and paste it into the schema.ts file we already created

## 7. Run Migrations
```bash
npx drizzle-kit push
```

or if using migrate:
```bash
npx drizzle-kit migrate
```

### This will create:

- users table
 
- better-auth required tables

*** The app will fail if migrations are not applied.

## 8. Setup Google OAuth

 1. Go to Google Cloud Console.

 2. Create OAuth credentials.

 3. Add authorized redirect URI:
```bash
http://localhost:3000/api/auth/callback/google
```

   Copy:
```bash
GOOGLE_CLIENT_ID

GOOGLE_CLIENT_SECRET
```
#### Paste into .env.

## 9. Setup Resend (Email Provider)

1. Create a Resend account.

2. Verify a sending domain or email.

3. Generate an API key.

#### Add to .env:
```bash
RESEND_API_KEY=your_key 

RESEND_EMAIL=your_verified_email 
```
- incase you dont have any verified email you can use 
``onboarding@resend.dev`` officially provided email that allows you to send emails to yourself

## 10. shadcn/ui Setup (If Needed)

If initializing manually:
```bash
npx shadcn@latest init
```
Ensure required components are installed (button, form, input, card, etc.).

## 11. Run the Development Server
```bash
npm run dev
```

Application runs at:

http://localhost:3000/

### Application Routes
 #### Public

- /signup

- /login

- /forgot-password

- /reset-password?token=...

#### Protected

- /dashboard

Unauthenticated users are automatically redirected to /login.

## Production Deployment Notes

### Before deploying:

- Update ``BASE_URL``

- Update ``BETTER_AUTH_URL``

- Update Google OAuth callback to production URL

- Ensure PostgreSQL is accessible

- Ensure Resend domain is verified if not use ``onboarding@resend.dev``
- Set strong ``BETTER_AUTH_SECRET``

### Expected Working Flow

After correct setup:

- User can sign up

- User can log in

- Google login works

- Forgot password sends email

- Reset password updates credentials

- Protected routes redirect properly

### If any of the above fails, verify:

- Environment variables
- Database migrations
- OAuth configuration
- Email provider setup