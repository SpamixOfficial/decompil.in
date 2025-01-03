import { Elysia, Context } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { plugin as playPlugin } from "./whatamiplayin";
import { setupPlugin } from "./setup";
import { ctfPlugin } from "./ctf";
import { helmet } from "elysia-helmet";
import { logger, fileLogger } from "@bogeychan/elysia-logger";
import { auth } from "./utils/auth";
import cors from "@elysiajs/cors";

// Better auth
const betterAuthView = (context: Context) => {
    const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]
    // validate request method
    if(BETTER_AUTH_ACCEPT_METHODS.includes(context.request.clone().method)) {
        return auth.handler(context.request.clone());
    } else {
        context.error(405)
    }
}

const app = new Elysia()
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
    .use(swagger({
        exclude: ["/setup"],
        documentation: {
            info: {
                title: 'Decompil.in API',
                version: '1.0.0'
            }
        }
    }))
    .use(setupPlugin)
    .use(playPlugin)
    .use(ctfPlugin)
    .all("/api/auth/*", betterAuthView) // Better auth
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
