import { MySql2Database } from "drizzle-orm/mysql2";
import { challengeFilesTable, challengeTable } from "../drizzle/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import { DBStatus } from "../drizzle";

/**
 * A challenge object
 * @typedef {Object} Challenge
 * @property {number} id - Id
 * @property {string} title - Title
 * @property {string} description - Description
 * @property {number} score - Score
 */

class Ctf {
    constructor(public db: MySql2Database<typeof import("../drizzle/db/schema")>) {}
    async getChallenges() {
        // Get all challenge items but remove flag, cause returning the flag would kind of ruin the challenge am I right? :D
        const challenges = await this.db.query.challengeTable.findMany({
            columns: {
                flag: false,
            },
            with: {
                solves: true,
                files: true,
            },
        });
        return challenges;
    }

    /**
     * Get a single challenge by its unique id number
     * @constructor
     * @param {number} id - The id of the challenge
     * @return {Challenge}
     */
    async getChallenge(id: number) {
        const challenge = await this.db.query.challengeTable.findFirst({
            columns: {
                flag: false,
            },
            where: eq(challengeFilesTable.id, id),
            with: {
                solves: true,
                files: true,
            },
        });

        if (challenge === undefined) {
            return DBStatus.NonExistantError;
        }
        return challenge;
    }

    async getChallengeFiles(id: number) {
        const files = await this.db.select().from(challengeFilesTable).where(eq(challengeFilesTable.challengeId, id));
        return files;
    }

    async createChallenge(challenge: {
        title: string;
        description: string;
        flag: string;
        score: number;
        files: string[];
    }) {
        // Insert files
        let newChallengeID = await this.db.transaction(async (tx) => {
            const { files, ...rest } = challenge;
            const [newChallenge] = await tx
                .insert(challengeTable)
                .values({ ...rest })
                .$returningId();
            if (files.length !== 0) {
                await tx
                    .insert(challengeFilesTable)
                    .values(files.map((x) => ({ url: x, challengeId: newChallenge.id })));
            }
            return newChallenge.id;
        });
        // return
        let newChallObj = await this.getChallenge(newChallengeID);
        return newChallObj;
    }

    async updateChallenge(
        id: number,
        challenge: {
            title?: string;
            description?: string;
            flag?: string;
            score?: number;
            files?: string[];
        }
    ) {
        const { files, ...rest } = challenge;

        await this.db.transaction(async (tx) => {
            try {
                await tx
                    .update(challengeTable)
                    .set({ ...rest })
                    .where(eq(challengeTable.id, id));
            } catch {
                // Ignore for now, most likely no values set
            }
            if (files !== undefined) {
                // delete all and insert new values. To update specific file use dedicated function
                await tx.delete(challengeFilesTable).where(eq(challengeFilesTable.challengeId, id));
                await tx.insert(challengeFilesTable).values(files.map((x) => ({ url: x, challengeId: id })));
            }
        });
        // return
        let challObj = await this.getChallenge(id);
        return challObj;
    }
}

export { Ctf };
