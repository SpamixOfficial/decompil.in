import { relations } from "drizzle-orm";
import {
    int,
    varchar,
    text,
    datetime,
    mysqlSchema,
    mysqlTable
} from "drizzle-orm/mysql-core";

export const challengeTable = mysqlTable("challenges", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar({ length: 255 }).notNull(),
    description: text().notNull(),
    flag: text().notNull(),
    score: int().default(0).notNull(),
});

export const challengeTableRelations = relations(
    challengeTable,
    ({ many }) => ({
        files: many(challengeFilesTable),
        solves: many(challengeSolveTable),
    })
);

export const challengeFilesTable = mysqlTable("challengeFiles", {
    id: int("id").autoincrement().primaryKey(),
    url: text().notNull(),
    challengeId: int().notNull(),
});

export const challengeFilesTableRelations = relations(
    challengeFilesTable,
    ({ one }) => ({
        challenge: one(challengeTable, {
            fields: [challengeFilesTable.challengeId],
            references: [challengeTable.id],
        }),
    })
);

export const challengeSolveTable = mysqlTable("challengeSolves", {
    id: int("id").autoincrement().primaryKey(),
    solveDate: datetime().notNull(),
    challengeId: int().notNull(),
    userId: int().notNull(),
});

export const challengeSolveTableRelations = relations(
    challengeSolveTable,
    ({ one }) => ({
        challenge: one(challengeTable, {
            fields: [challengeSolveTable.challengeId],
            references: [challengeTable.id],
        }),
        user: one(usersTable, {
            fields: [challengeSolveTable.userId],
            references: [usersTable.id],
        }),
    })
);

export const usersTable = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    username: varchar({ length: 255 }).notNull().unique(),
    tokenHash: varchar({ length: 118 }).notNull(),
    score: int().notNull().default(0),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
    solves: many(challengeSolveTable),
    sessions: many(sessionTable),
}));

export const sessionTable = mysqlTable("sessions", {
    session: int().notNull(),
    userId: int().notNull(),
});

export const sessionTableRelations = relations(sessionTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [sessionTable.userId],
        references: [usersTable.id],
    }),
}));
