import { Elysia, t } from "elysia";
import queryString from "querystring";

declare module "bun" {
    interface Env {
        TOKEN_REFRESH: number;
        SPOTIFY_CLIENT_ID: string;
        SPOTIFY_CLIENT_SECRET: string;
        SPOTIFY_TOKEN: string | undefined;
        APP_BASE_URL: string;
        CALLBACK: string;
    }
}

export const setupPlugin = new Elysia({ name: "setup" }).get(
    "/setup",
    async ({ redirect, set, query }) => {
        // Auth and "already-setup" checking
        if (Bun.env.SPOTIFY_TOKEN !== undefined) {
            set.status = 404;
            return null;
        }

        if (query.auth != Bun.env.BACKEND_PWD) {
            set.status = 401;
            return null;
        }

        if (query.code === undefined) {
            return redirect(
                `https://accounts.spotify.com/authorize?client_id=${Bun.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${Bun.env.CALLBACK}&scope=user-read-currently-playing`,
                302
            );
        }

        let resp = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            body: queryString.stringify({
                grant_type: "authorization_code",
                code: query.code,
                redirect_uri: Bun.env.APP_BASE_URL + "/setup",
            }),
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " +
                    Buffer.from(
                        Bun.env.SPOTIFY_CLIENT_ID +
                            ":" +
                            Bun.env.SPOTIFY_CLIENT_SECRET
                    ).toString("base64"),
            },
        });
        let jsresp = await resp.json();
        return `Go ahead and add this token to your .env file, and you'll be done!\n\nToken: ${jsresp.refresh_token}`;
    },
    {
        query: t.Object({
            auth: t.String(),
            code: t.Optional(t.String()),
        }),
        response: { 200: t.String(), 401: t.Null(), 404: t.Null() },
    }
);
