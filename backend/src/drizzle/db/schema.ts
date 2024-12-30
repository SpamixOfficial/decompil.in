import {
    int,
    mysqlTable,
    serial,
    varchar,
    text,
    datetime,
} from "drizzle-orm/mysql-core";

export const challengeTable = mysqlTable("challenges", {
    id: int().autoincrement().primaryKey(),
    title: varchar({ length: 255 }).notNull(),
    description: text().notNull(),
    flag: text().notNull(),
    score: int().default(0),
});

export const challengeFilesTable = mysqlTable("challengeFiles", {
    id: int().autoincrement().primaryKey(),
    url: text().notNull(),
    challengeId: int().notNull(),
});

export const challengeSolveTable = mysqlTable("challengeSolves", {
    id: int().autoincrement().primaryKey(),
    solveDate: datetime().notNull(),
    challengeId: int().notNull(),
    userId: int().notNull(),
});

export const usersTable = mysqlTable("users", {
    id: int().autoincrement().primaryKey(),
    username: varchar({ length: 255 }).notNull(),
    token: varchar({ length: 255 }),
    tokenHash: varchar({ length: 118 }).notNull(),
});
