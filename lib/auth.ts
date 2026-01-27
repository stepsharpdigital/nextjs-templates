import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { schema } from "@/db/schema";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/app/emails/reset-password";
import { organization } from "better-auth/plugins"
import { getInitialOrganization } from "@/server/organizations";


const resend = new Resend(process.env.RESEND_API_KEY as string);
const RESEND_EMAIL_FROM =
  (process.env.RESEND_EMAIL as string) || "onboarding@resend.dev";

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
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          // Implement your custom logic to set initial active organization
          const organization = await getInitialOrganization(session.userId);
          return {
            data: {
              ...session,
              activeOrganizationId: organization?.id,
            },
          };
        },
      },
    },
  },
  database: drizzleAdapter(db, {  // db is our Drizzle instance
    provider: "pg", //Postgre
    schema, // our database schema
  }),
  plugins: [
    organization(),
    nextCookies()
    ],
});
