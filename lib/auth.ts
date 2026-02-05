import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { schema, user } from "@/db/schema";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/app/emails/reset-password";
import {stripe} from "@better-auth/stripe";
import Stripe from "stripe";
import { STRIPE_PLANS } from "./stripe/stripe";
import { getCurrentUser } from "@/server/users";
import { eq } from "drizzle-orm";
const resend = new Resend(process.env.RESEND_API_KEY as string);
const RESEND_EMAIL_FROM =
  (process.env.RESEND_EMAIL as string) || "onboarding@resend.dev";

  const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover", // Latest API version
})

// Initialize Better Auth instance with Drizzle Adapter and Next.js cookies
export const auth = betterAuth({
  socialProviders: {
    google: {
      //Google OAuth provider configuration
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    //Enable email and password authentication
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      //Function to send password reset email
      resend.emails.send({
        from: RESEND_EMAIL_FROM,
        to: user.email,
        subject: "Reset Your Password",
        react: ForgotPasswordEmail({ username: user.name, resetUrl: url }), //Using React component for email content
      });
    },
  },
  database: drizzleAdapter(db, {  // db is our Drizzle instance
    provider: "pg", //Postgre
    schema, // our database schema
  }),
  advanced:{
    database: {
      generateId: "uuid"
    }
  },
  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
  enabled: true,
  authorizeReference: async ({ user, referenceId }) => {
      return user.id === referenceId;
  },
  plans: STRIPE_PLANS,
}
    }),
    nextCookies()],
});
