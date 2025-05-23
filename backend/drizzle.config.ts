import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: ["./src/drizzle/db/schema.ts", "./src/drizzle/db/auth-schema.ts", "./src/drizzle/db/log-schema.ts"],
    dialect: "mysql",
    dbCredentials: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        url: process.env.MYSQL_HOST
    },
});
