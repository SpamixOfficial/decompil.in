import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { plugin as playPlugin } from "./whatamiplayin";
import { setupPlugin } from "./setup";
import { ctfPlugin } from "./ctf";
import { helmet } from "elysia-helmet";
import { logger, fileLogger } from "@bogeychan/elysia-logger";
import cors from "@elysiajs/cors";


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
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
