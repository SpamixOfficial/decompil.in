import { int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const access_log = mysqlTable("acclog", {
    ip: text("ip").notNull(),
    country: varchar("country", {length: 2}).notNull(),
    path: text("path"),
    ua: text("ua"),
    cookie: text("cookie"),
    count: int("count").notNull().$default(() => 0)
});