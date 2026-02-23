# Next.js SaaS Boilerplate Collection

A production-ready, reusable Next.js boilerplate repository designed for building modern SaaS applications.

This repository is structured into multiple branches. Each branch represents a fully working, independent implementation that builds incrementally on the previous one.

The goal is to provide a clean, scalable foundation that can be reused across future SaaS projects - including web and mobile applications.

## Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **PostgreSQL**
- **Drizzle ORM**
- **better-auth**
- **shadcn/ui**
- **Stripe**
- **Resend (Email)**
- **Zod**
- **React Hook Form**

All branches use:
- API routes (for mobile compatibility)
- Clean folder structure
- Reusable components
- Proper database schema management
- Production-oriented patterns



## Repository Structure (Branches Overview)
Each branch is fully functional and production-ready.


### 1. `branch1-auth-core`

Authentication core boilerplate.

**Includes:**
- Email + password signup
- Email + password login
- Forgot password
- Reset password
- Google OAuth
- Protected routes
- Basic dashboard
- PostgreSQL + Drizzle setup
- Resend email integration

This branch serves as the foundational authentication template for future SaaS apps.


### 2. `branch2-auth-stripe`

Includes everything from **branch1-auth-core** plus:

- Stripe Checkout subscriptions
- Stripe customer storage
- Subscription syncing via webhooks
- Billing page
- Stripe customer portal integration

This branch is ideal for individual-user SaaS products.


### 3. `branch3-auth-organizations`

Includes everything from **branch1-auth-core** plus:

- Organization creation
- Member invitations
- Role-based access control (OWNER, ADMIN, MEMBER)
- Multi-organization support
- Organization switching
- Organization settings and member management

This branch is designed for B2B or team-based SaaS products.


### 4. `branch4-org-subs-per-member`

Includes everything from **branch3-auth-organizations** plus:

- Organization-based Stripe subscriptions
- Per-member billing model
- Automatic Stripe quantity syncing with member count
- Organization billing portal
- Subscription-based feature restriction

This branch is built for scalable team SaaS platforms with usage-based billing.


## Design Principles

- Clean and modular architecture
- Mobile-ready APIs
- Strict TypeScript usage
- Database-first design with Drizzle
- Form validation using Zod
- UI consistency with shadcn/ui
- Easily extendable for future SaaS features

## How to Use This Repository

1. Clone the repository.
```bash
git clone https://github.com/talhasultan-dev/nextjs-templates.git
```
2. Switch to the branch that matches your use case:
```bash
   git checkout branch-name
```
3. Follow the README inside that branch for detailed setup instructions.

- Each branch contains its own setup guide and environment configuration instructions.
