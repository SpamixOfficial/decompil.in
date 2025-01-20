import { MySql2Database } from "drizzle-orm/mysql2";
import { challengeFilesTable, challengeGuidanceTable, challengeSolveTable, challengeTable } from "../drizzle/db/schema";
import { asc, eq, and, sql } from "drizzle-orm";
import { DBStatus } from "../drizzle";
import { user } from "../drizzle/db/auth-schema";
import { number } from "better-auth/*";

/**
 * A challenge object
 * @typedef {Object} Challenge
 * @property {number} id - Id
 * @property {string} title - Title
 * @property {string} description - Description
 * @property {number} score - Score
 */

class Ctf {
    constructor(
        public db: MySql2Database<typeof import("../drizzle/db/schema") & typeof import("../drizzle/db/auth-schema")>
    ) {}
    async getChallenges(userid?: string) {
        // Get all challenge items but remove flag, cause returning the flag would kind of ruin the challenge am I right? :D
        let challenges = await this.db.query.challengeTable.findMany({
            columns: {
                flag: false,
            },
            with: {
                files: true,
            },
        });

        if (userid !== undefined) {
            const userSolves = (await this.getUserSolves(userid)).map((x) => x.challengeId);
            return challenges.map((x) => ({ ...x, solved: userSolves.includes(x.id) }));
        } else {
            return challenges.map((x) => ({ ...x, solved: false }));
        }
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

    async getUser(id: string) {
        let userObj = await this.db.query.user.findFirst({
            columns: {
                id: true,
                name: true,
                image: true,
                score: true,
                githubUrl: true,
            },
            where: eq(user.id, id),
        });

        if (userObj === undefined) {
            return DBStatus.NonExistantError;
        }
        return userObj;
    }

    async updateUserSocials(id: string, socials: { githubUrl?: string }) {
        if ((await this.getUser(id)) === DBStatus.NonExistantError) {
            return DBStatus.NonExistantError;
        }
        await this.db.transaction(async (tx) => {
            try {
                await tx.update(user).set(socials).where(eq(user.id, id));
            } catch {
                // Ignore for now, most likely no values set
            }
        });
        return await this.getUser(id);
    }

    async leaderboard() {
        let leaderboard = await this.db.query.user.findMany({
            columns: {
                id: true,
                name: true,
                image: true,
                score: true,
                githubUrl: true,
            },
            orderBy: [asc(user.score)],
        });

        return leaderboard;
    }

    async checkChallFlag(id: number, flag: string) {
        const challFlag = await this.db.query.challengeTable.findFirst({
            columns: {
                flag: true,
            },
            where: eq(challengeFilesTable.id, id),
        });

        if (challFlag === undefined) {
            return DBStatus.NonExistantError;
        }

        if (challFlag.flag !== flag) {
            return false;
        }
        return true;
    }

    async getSolve(id: number) {
        let solveObj = await this.db.query.challengeSolveTable.findFirst({
            where: eq(challengeSolveTable.id, id),
            with: {
                user: true,
            },
        });

        if (solveObj === undefined) {
            return DBStatus.NonExistantError;
        }
        return solveObj;
    }

    async getUserSolves(userId: string) {
        let solveObjs = await this.db.query.challengeSolveTable.findMany({
            where: eq(challengeSolveTable.userId, userId),
        });

        return solveObjs;
    }

    async createSolve(data: { challId: number; userId: string }) {
        let solved = (await this.getUserSolves(data.userId)).map((x) => x.challengeId).includes(data.challId);
        if (solved) {
            return DBStatus.NotValidError;
        };
        let insertData = {
            challengeId: data.challId,
            userId: data.userId,
        };
        let newSolveID = await this.db.transaction(async (tx) => {
            const [newSolve] = await tx.insert(challengeSolveTable).values(insertData).$returningId();
            
            // increment solve counter on chall
            await tx
                .update(challengeTable)
                .set({ solves: sql`${challengeTable.solves} + 1` })
                .where(eq(challengeTable.id, data.challId));
            
            return newSolve.id;
        });

        // return
        let newSolveObj = await this.getSolve(newSolveID);
        return newSolveObj;
    }

    async awardPoints(userId: string, points: number) {
        await this.db.transaction(async (tx) => {
            await tx.update(user).set({ score: points }).where(eq(user.id, userId));
        });
    }

    async getGuides(challId: number) {
        let guideObjs = await this.db.query.challengeGuidanceTable.findMany({
            where: and(eq(challengeGuidanceTable.challengeId, challId), eq(challengeGuidanceTable.approved, true)),
            columns: {
                id: true,
                challengeId: true,
                approved: true,
                body: true,
                userId: true,
                createdAt: true,
            },
        });

        return guideObjs;
    }

    async getAllApprovedGuides() {
        let guideObjs = await this.db.query.challengeGuidanceTable.findMany({
            where: eq(challengeGuidanceTable.approved, true),
            columns: {
                id: true,
                challengeId: true,
                approved: true,
                body: true,
                userId: true,
                createdAt: true,
            },
            with: {
                user: true,
                challenge: true,
            },
        });

        return guideObjs;
    }

    async getAllGuides() {
        let guideObjs = await this.db.query.challengeGuidanceTable.findMany({
            with: {
                user: true,
                challenge: true,
            },
        });

        return guideObjs;
    }

    async getUnapprovedGuides() {
        let guideObjs = await this.db.query.challengeGuidanceTable.findMany({
            where: eq(challengeGuidanceTable.approved, false),
            with: {
                user: true,
                challenge: true,
            },
        });

        return guideObjs;
    }

    async getGuide(guideId: number) {
        let guideObj =
            (await this.db.query.challengeGuidanceTable.findFirst({
                where: and(eq(challengeGuidanceTable.id, guideId), eq(challengeGuidanceTable.approved, true)),
                columns: {
                    id: true,
                    body: true,
                    userId: true,
                    createdAt: true,
                },
            })) || DBStatus.NonExistantError;

        return guideObj;
    }

    async approveGuide(guideID: number) {
        await this.db.transaction(async (tx) => {
            await tx
                .update(challengeGuidanceTable)
                .set({ approved: true })
                .where(eq(challengeGuidanceTable.id, guideID));
        });
    }

    async unApproveGuide(guideID: number) {
        await this.db.transaction(async (tx) => {
            await tx
                .update(challengeGuidanceTable)
                .set({ approved: false })
                .where(eq(challengeGuidanceTable.id, guideID));
        });
    }

    async deleteGuide(guideID: number) {
        await this.db.delete(challengeGuidanceTable).where(eq(challengeGuidanceTable.id, guideID));
    }

    async createGuide(data: { challId: number; userId: string; body: string }) {
        let insertData = {
            challengeId: data.challId,
            userId: data.userId,
            body: data.body,
        };
        await this.db.transaction(async (tx) => {
            await tx.insert(challengeGuidanceTable).values(insertData);
        });
    }
}

export { Ctf };
