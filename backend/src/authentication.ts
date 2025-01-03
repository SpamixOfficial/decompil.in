import { Elysia } from "elysia";
import bearer from "@elysiajs/bearer";
import { MySql2Database } from "drizzle-orm/mysql2";
import { usersTable } from "./drizzle/db/schema";
import { and, eq, getTableColumns, ilike } from "drizzle-orm";
import { DBStatus } from "./drizzle";

class Users {
    constructor(public db: MySql2Database<typeof import("./drizzle/db/schema")>) {}

    async validCredentials(username: string, token: string) {
        let userInfo = await this.db
            .select()
            .from(usersTable)
            .where(eq(usersTable.username, username));
        // Abort if not 1, this means that if there is no result we just abort
        // In case of duplicate accounts we also abort, even though that scenario techincally isnt possible!
        // Btw this also checks username
        if (userInfo.length !== 1) {
            return DBStatus.NotValidError;
        }
        let tokenHash = userInfo[0].tokenHash;
        // Final check!
        if (!(await Bun.password.verify(token, tokenHash))) {
            return DBStatus.NotValidError;
        } else {
            return DBStatus.Ok;
        }
    }

    async userExists(id: number) {
        let userInfo = await this.db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, id));

        if (userInfo.length !== 1) {
            return false;
        }
        return true;
    }

    async searchUsers(username?: string, id?: number) {
        const { tokenHash, ...rest } = getTableColumns(usersTable);
        let search = await this.db
            .select({ ...rest })
            .from(usersTable)
            .where(
                and(
                    username ? ilike(usersTable.username, username) : undefined,
                    id ? eq(usersTable.id, id) : undefined
                )
            );
        return search;
    }

    async getUserByID(id: number) {
        if (!(await this.userExists(id))) {
            return null;
        }
        const { tokenHash, ...rest } = getTableColumns(usersTable);
        let search = await this.db
            .select({ ...rest })
            .from(usersTable)
            .where(eq(usersTable.id, id))
            .limit(1);
        return search[0];
    }

    async createUser(username: string, token: string) {
        let userInfo = await this.db
            .select()
            .from(usersTable)
            .where(eq(usersTable.username, username));
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
}

const authentication = new Elysia({ name: "authentication" })
    .use(bearer())
    .macro({
        protected() {
            return {
                beforeHandle({ bearer, set }) {
                    if (!bearer || bearer !== Bun.env.BACKEND_PWD) {
                        set.status = 401;
                        set.headers[
                            "WWW-Authenticate"
                        ] = `Bearer realm='sign', error="invalid_request"`;

                        return "Unauthorized";
                    }
                },
            };
        },
    });

export { Users, authentication };
