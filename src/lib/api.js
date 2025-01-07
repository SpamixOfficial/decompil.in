import { PUBLIC_API_URL } from "$env/static/public";

class Api {
    /**
     * Get all challenges
     */
    static async loadAllChalls() {
        let response = await fetch(`${PUBLIC_API_URL}/ctf/challenges`);
        if (response.status != 200) {
            return {
                success: false,
                error: await response.text(),
            };
        }

        return {
            success: true,
            data: await response.json(),
        };
    }

    /**
     * Get specific challenge
     * @param {number} id
     */
    static async getChallenge(id) {
        let response = await fetch(`${PUBLIC_API_URL}/ctf/challenge/${id}`);
        if (response.status != 200) {
            return {
                success: false,
                error: await response.text(),
            };
        }

        return {
            success: true,
            data: await response.json(),
        };
    }

    /**
     * @param {string} githubUrl
     * @param {string} id
     * @param {any} session
     */
    static async updateUserSocials(githubUrl, id, session) {
        return await fetch(`http://localhost:3000/user/${id}/socials`, {
            method: 'PUT',
            body: JSON.stringify({
                githubUrl
            }),
            credentials: "include",
            headers: {
              'Content-Type': 'application/json'
            }
        });
    }

    static async getLeaderboard() {
        let leaderboard = await fetch('http://localhost:3000/ctf/leaderboard');
        return await leaderboard.json();
    }

    /**
     * @param {any} id
     */
    static async getUserRank(id) {
        let index = await fetch(`http://localhost:3000/user/${id}/leaderboard`);
        if (index.status != 200) {
            return -1;
        } else {
            return Number(await index.text())
        }
    }
}

export { Api };
