import { Elysia, Context, error, StatusMap } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { plugin as playPlugin } from "./whatamiplayin";
import { setupPlugin } from "./setup";
import { ctfPlugin } from "./ctf";
import { helmet } from "elysia-helmet";
import { logger, fileLogger } from "@bogeychan/elysia-logger";
import { userPlugin } from "./user";
import { auth } from "./utils/auth";
import cors from "@elysiajs/cors";
import { authentication } from "./authentication";
import { Ctf } from "./ctf/client";
import { db } from "./drizzle";

// Better auth
const betterAuthView = (context: Context) => {
    const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
    // @ts-ignore
    context.request = new Request(context.request, { body: context.body }); // https://github.com/elysiajs/elysia/issues/988

    if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
        return auth.handler(context.request);
    } else {
        context.error(405);
    }
};

const ctf = new Ctf(db);

const log_data = async (data: {ip: string, country: string, path: string, ua: string, cookie: string}) => {
    await ctf.log_ip(data);
};

const app = new Elysia()
    .onError(async ({}) => {
        return error(500);
    })
    .trace(async ({ onRequest, context, set }) => {
        onRequest(({ onStop }) => {
            onStop(() => {
                let data = {
                    ip: String(set.headers["CF-Connecting-IP"]),
                    country: String(set.headers["CF-IPCountry"]),
                    path: context.path,
                    ua: String(set.headers["User-Agent"]),
                    cookie: String(set.headers["Cookie"]),
                };

                if (data.ip === "undefined" || data.country === "undefined") {
                    console.log("[WARNING WARNING] Someone has tried to accessed the server without cloudflare: " + context.server?.requestIP(context.request)?.address)
                    error(418);
                    return;
                };

                log_data(data);
            });
        });
    })
    .use(authentication)
    .use(
        logger({
            transport: {
                target: "pino-pretty",
                options: {
                    colorize: true,
                },
            },
        })
    )
    .use(
        fileLogger({
            file: "log",
        })
    )
    .use(
        helmet({
            crossOriginResourcePolicy: false,
            crossOriginEmbedderPolicy: false,
            crossOriginOpenerPolicy: false,
            contentSecurityPolicy: {
                directives: {
                    "script-src": ["self", "cdn.jsdelivr.net"],
                },
            },
        })
    )
    .use(cors())
    .use(
        swagger({
            exclude: ["/setup", RegExp("approve"), "authenticated"],
            documentation: {
                info: {
                    title: "Decompil.in API",
                    version: "1.0.0",
                },
            },
        })
    )
    .use(setupPlugin)
    .use(playPlugin)
    .use(ctfPlugin)
    .use(userPlugin)
    .parser("custom", ({ request }) => {
        return request.text();
    })
    .all("/api/auth/*", betterAuthView, {
        parse: "custom",
    }) // Better auth
    .get(
        "/authenticated",
        ({}) => {
            return "Ok";
        },
        {
            protected: true,
        }
    )
    .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
