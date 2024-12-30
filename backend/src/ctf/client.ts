import { MySql2Database } from "drizzle-orm/mysql2";
import { challengeTable } from "../drizzle/db/schema";
import { t } from "elysia";

class Ctf {
    constructor(public db: MySql2Database) {}
    async getChallenges() {
        // Get all challenge items but remove flag, cause returning the flag would kind of ruin the challenge am I right? :D
        const challenges = (await this.db.select().from(challengeTable)).map(
            ({ flag, ...item }) => {
                item;
            }
        );
        console.log(challenges);
        return challenges;
    }
    async createChallenge(
        pwd: string,
        challenge: {
            title: string;
            description: string;
            flag: string;
            score: number;
        },
        challengeFiles: string[]
    ) {
        if (pwd !== process.env.BACKEND_PWD) {
            return 401;
        }
        await this.db.insert(challengeTable).values(challenge);
        return 200;
    }
}

export { Ctf };
