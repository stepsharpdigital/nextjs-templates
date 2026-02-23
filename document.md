<div align="center">

# Next.js SaaS Boilerplate Collection

### A production-ready, reusable Next.js boilerplate for building modern SaaS applications.

Multi-branch architecture — auth, payments, organizations, and per-member billing — fully wired.<br/>
**Clone it. Switch branches. Ship it.**

![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)

</div>

---

## What You Get

> One repo. Four branches. Every SaaS pattern covered.

| Feature | What's Inside |
|---|---|
| **Auth** | Better Auth — email/password, Google OAuth, forgot/reset password, protected routes |
| **Payments** | Stripe — subscriptions, webhooks, customer portal, per-member billing |
| **Database** | Drizzle ORM + PostgreSQL — clean schema management, production-oriented |
| **Email** | Resend — transactional emails for auth flows |
| **Organizations** | Multi-org support, member invitations, role-based access control |
| **UI** | Shadcn/ui — accessible, consistent component system |
| **Validation** | Zod + React Hook Form — strict, type-safe form handling |
| **API** | API routes throughout — designed for mobile compatibility |

---

## How to Use This Repository

1. Clone the repository:
```bash
git clone https://github.com/stepsharpdigital/nextjs-templates.git
```

2. Switch to the branch that matches your use case:
```bash
git checkout branch-name
```

3. Follow the README inside that branch for detailed setup instructions.

Each branch contains its own setup guide and environment configuration instructions.

---

## Repository Structure

Each branch is **fully functional and production-ready**, building incrementally on the previous one.

All branches include:
- API routes (for mobile compatibility)
- Clean folder structure
- Reusable components
- Proper database schema management
- Production-oriented patterns

### `branch1-auth-core` - Authentication Foundation

The foundational authentication template for any SaaS app.

- Email + password signup & login
- Forgot password & reset password
- Google OAuth
- Protected routes & basic dashboard
- PostgreSQL + Drizzle setup
- Resend email integration

---

### `branch2-auth-stripe` - Payments

Everything from **branch1-auth-core**, plus:

- Stripe Checkout subscriptions
- Stripe customer storage
- Subscription syncing via webhooks
- Billing page & Stripe customer portal

*Ideal for individual-user SaaS products.*

---

### `branch3-auth-organizations` - Teams & Roles

Everything from **branch1-auth-core**, plus:

- Organization creation & switching
- Member invitations
- Role-based access control (OWNER, ADMIN, MEMBER)
- Multi-organization support
- Organization settings & member management

*Designed for B2B or team-based SaaS products.*

---

### `branch4-org-subs-per-member` - Scalable Billing

Everything from **branch3-auth-organizations**, plus:

- Organization-based Stripe subscriptions
- Per-member billing model
- Automatic Stripe quantity syncing with member count
- Organization billing portal
- Subscription-based feature restriction

*Built for scalable team SaaS platforms with usage-based billing.*

---

## Tech Stack

| Tech | Purpose |
|---|---|
| [Next.js](https://nextjs.org) | App Router, Server Components, API Routes |
| [TypeScript](https://www.typescriptlang.org) | Strict mode, end-to-end type safety |
| [PostgreSQL](https://www.postgresql.org) | Primary database |
| [Drizzle ORM](https://orm.drizzle.team) | Type-safe queries, migrations |
| [Better Auth](https://better-auth.com) | OAuth, sessions, protected routes |
| [Stripe](https://stripe.com) | Payments, subscriptions, webhooks |
| [Resend](https://resend.com) | Transactional email |
| [Shadcn/ui](https://ui.shadcn.com) | Accessible, customizable components |
| [Zod](https://zod.dev) | Schema validation |
| [React Hook Form](https://react-hook-form.com) | Performant, type-safe forms |

---

## Design Principles

- Clean and modular architecture
- Mobile-ready APIs throughout
- Strict TypeScript usage
- Database-first design with Drizzle
- Form validation using Zod + React Hook Form
- UI consistency with Shadcn/ui
- Easily extendable for future SaaS features

---

## License

MIT - free to use, modify, and ship.

---

<div align="center">

Made by [Step Sharp Digital](https://github.com/stepsharpdigital)

### ⭐ Star this repo if it helped you. 

</div>