import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins"
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
        discord: { 
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET! 
        }, 
    },
    baseURL: process.env.APP_BASE_URL!,
    trustedOrigins: [process.env.FRONTEND_URL!, process.env.APP_BASE_URL!],
    user: {
        additionalFields: {
            score: {
                type: "number"
            },
            githubUrl: {
                type: "string"
            }
        }
    },
    plugins: [
        genericOAuth({
            config: [
                {
                    providerId: "slack",
                    clientId: process.env.SLACK_CLIENT_ID!,
                    clientSecret: process.env.SLACK_CLIENT_SECRET!,
                    discoveryUrl: "https://slack.com/.well-known/openid-configuration",
                    scopes: ['openid', 'profile', 'email'],
                    redirectURI: `${process.env.APP_BASE_URL}/api/auth/oauth2/callback/slack`
                }
            ]
        })
    ]
});
