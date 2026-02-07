import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";

// Create and export an authentication client that will communicate with our server-side auth instance
export const authClient = createAuthClient({
    //The base URL of the server (optional if you're using the same domain)
    baseURL: process.env.BASE_URL || "http://localhost:3000",
     plugins: [ 
        organizationClient(),
         stripeClient({
            subscription: true //if you want to enable subscription management
        })
    ] 
})