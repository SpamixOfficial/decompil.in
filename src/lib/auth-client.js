import { createAuthClient } from "better-auth/svelte";
import { PUBLIC_API_URL } from "$env/static/public";
import { inferAdditionalFields } from "better-auth/client/plugins";
export const authClient = createAuthClient({
    baseURL: PUBLIC_API_URL,
    plugins: [
        inferAdditionalFields({
            user: {
                score: {
                    type: "number",
                },
                githubUrl: {
                    type: "string",
                },
            },
        }),
    ],
});
