import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./db/schema";
import * as auth_schema from "./db/auth-schema";
import * as log_schema from "./db/log-schema";
import mysql from "mysql2/promise";

// Some bun env variable declarations
declare module "bun" {
    interface Env {
        MYSQL_HOST: string;
        MYSQL_USER: string;
        MYSQL_PASSWORD: string;
        MYSQL_DATABASE: string;
    }
}

// Custom db error
export enum DBStatus {
    Ok,
    Error,
    NonExistantError,
    AlreadyExistsError,
    NotValidError,
}

const pool = mysql.createPool({
    host: Bun.env.MYSQL_HOST,
    user: Bun.env.MYSQL_USER,
    password: Bun.env.MYSQL_PASSWORD,
    database: Bun.env.MYSQL_DATABASE,
});

export const db = drizzle({ client: pool, schema: {...schema, ...auth_schema, ...log_schema}, mode: "default" });
