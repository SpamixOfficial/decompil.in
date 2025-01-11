import { Elysia } from "elysia";
import bearer from "@elysiajs/bearer";
import { auth } from "./utils/auth";
import { Ctf } from "./ctf/client";
import { db } from "./drizzle";

const authentication = new Elysia({ name: "authentication" })
    .decorate("ctf", new Ctf(db))
    .use(bearer())
    .macro({
        protected() {
            return {
                beforeHandle({ bearer, set }) {
                    console.log(bearer);
                    if (!bearer || bearer !== Bun.env.BACKEND_PWD) {
                        set.status = 401;
                        set.headers["WWW-Authenticate"] = `Bearer realm='sign', error="invalid_request"`;

                        return "Unauthorized";
                    }
                },
            };
        },
        signinRequired() {
            return {
                async beforeHandle({ request, set }) {
                    const session = await auth.api.getSession({ headers: request.headers });
                    if (!session) {
                        set.status = 401;
                        return "Please sign in to access this route!";
                    }
                },
            };
        },
        signinProtected() {
            return {
                async beforeHandle({ request, set, params: { id }}) {
                    const session = await auth.api.getSession({ headers: request.headers });
                    if (!session) {
                        set.status = 401;
                        return "Please sign in to access this route!";
                    };

                    if (session.user.id !== id.toString()) {
                        set.status = 401;
                        return "You're not allowed here :3";
                    }
                },
            };
        }
    });

export { authentication };
