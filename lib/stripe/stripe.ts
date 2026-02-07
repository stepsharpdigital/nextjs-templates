
import type { StripePlan } from "@better-auth/stripe";

export const STRIPE_PLANS = [
  {
    name: "starter",
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    limits: {
      projects: 10,
      storage: 5,
      members: 5, 
    },
  },
  {
    name: "team",            
    priceId: process.env.STRIPE_TEAM_PRICE_ID!, 
    limits: {
      projects: 100,
      storage: 50,
      members: Infinity,       
    },
  },
  {
    name: "business",
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID!,
    limits: {
      projects: 500,
      storage: 200,
      members: Infinity,
    },
  },
] as const satisfies StripePlan[];