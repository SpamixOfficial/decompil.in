import { Elysia, error } from "elysia";
import bearer from "@elysiajs/bearer";
import { auth } from "./utils/auth";
//import { MySql2Database } from "drizzle-orm/mysql2";
//import { sessionTable, usersTable } from "./drizzle/db/schema";
//import { and, eq, ilike } from "drizzle-orm";
//import { db, DBStatus } from "./drizzle";

/*class Users {
    constructor(public db: MySql2Database<typeof import("./drizzle/db/schema")>) {}

    async validCredentials(username: string, token: string) {
        let userInfo = await this.db.query.usersTable.findFirst({
            where: eq(usersTable.username, username),
        });
        // Abort if no result (username can't be valid)
        if (userInfo === undefined) {
            return DBStatus.NotValidError;
        }
        // Final check!
        if (!(await Bun.password.verify(token, userInfo.tokenHash))) {
            return DBStatus.NotValidError;
        } else {
            return DBStatus.Ok;
        }
    }

    async searchUsers(queryData: { username?: string; id?: number }) {
        let search = await this.db.query.usersTable.findMany({
            columns: {
                tokenHash: false,
            },
            where: and(
                queryData.username ? ilike(usersTable.username, queryData.username) : undefined,
                queryData.id ? eq(usersTable.id, queryData.id) : undefined
            ),
        });

        return search;
    }

    async getUserByID(id: number) {
        let userInfo = await this.db.query.usersTable.findFirst({
            columns: {
                tokenHash: false,
            },
            where: eq(usersTable.id, id),
        });
        if (userInfo === undefined) {
            return DBStatus.NonExistantError;
        }

        return userInfo;
    }

    async createUser(username: string, token: string) {
        let userInfo = await this.db.select().from(usersTable).where(eq(usersTable.username, username));
        if (userInfo.length != 0) {
            return DBStatus.AlreadyExistsError;
        }
        let tokenHash = await Bun.password.hash(token);
        let newUser = (
            await this.db
                .insert(usersTable)
                .values({
                    username: username,
                    tokenHash: tokenHash,
                })
                .$returningId()
        )[0];
        return await this.getUserByID(newUser.id);
    }

    async createUserSession(id: number) {
        const session = crypto.getRandomValues(new Uint32Array(1))[0];
        await this.db.insert(sessionTable).values({ session, userId: id });
        return session;
    }

    async revokeUserSession(session: number) {
        await this.db.delete(sessionTable).where(eq(sessionTable.session, session));
    }

    async isSessionOk(session: number) {
        return (
            (await this.db.query.sessionTable.findFirst({
                where: eq(sessionTable.session, session),
            })) !== undefined
        );
    }
}

function genToken(length: number) {
    let l = "";
    let a = 0;
    while (a < length) {
        let b = Math.random().toString(36).substring(2);
        a += b.length;
        l = l + b;
        console.log(a);
    }
    return l.substring(0, length);
}*/

const authentication = new Elysia({ name: "authentication" }).use(bearer()).macro({
    protected() {
        return {
            beforeHandle({ bearer, set }) {
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
            async beforeHandle({request, set}) {
                const session = await auth.api.getSession({ headers: request.headers });
                if (!session) {
                    set.status = 401;
                    return "Please sign in to access this route!"
                }
            }
        }
    }
});

export { authentication };
