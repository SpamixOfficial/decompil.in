import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Some bun env variable declarations
declare module "bun" {
    interface Env {
        MYSQL_HOST: string
        MYSQL_USER: string,
        MYSQL_PASSWORD: string,
        MYSQL_DATABASE: string
    }
}

const poolConnection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export const db = drizzle({
    client: poolConnection
});