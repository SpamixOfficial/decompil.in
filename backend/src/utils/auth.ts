import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../drizzle";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        // We're using Drizzle as our database
        provider: "mysql",
    }),
    emailAndPassword: {
      enabled: false
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
    },
});
