import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "./mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true, autoSignIn: false }, // register → redirect to login
  
  trustedOrigins: [
    "https://phheroassign.netlify.app",
    "http://localhost:3000",
  ],
  socialProviders: {
    google: { clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! },
  },
  user: { additionalFields: {} },
});