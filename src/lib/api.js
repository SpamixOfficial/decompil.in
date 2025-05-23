import { PUBLIC_API_URL } from "$env/static/public";

class Api {
    /**
     * Get all challenges
     */
    static async loadAllChalls() {;
        let response = new Response();
        try {
            response = await fetch(`${PUBLIC_API_URL}/ctf/challenges`, {
                credentials: "include",
            });
        } catch(e) {
            response = new Response(new Blob(), {status: 500}); // Really code doesn't matter as long as it isn't 200!
        }
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
     * Get guides
     * @param {number} id
     */
    static async loadAllChallGuides(id) {
        let response = await fetch(`${PUBLIC_API_URL}/ctf/challenge/${id}/guides`);
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
     * Get guide
     * @param {number} id
     */
    static async getGuide(id) {
        let response = await fetch(`${PUBLIC_API_URL}/ctf/guides/${id}`);
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
        let response = await fetch(`${PUBLIC_API_URL}/ctf/challenge/${id}`, {
            credentials: "include",
        });
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
        return await fetch(`${PUBLIC_API_URL}/user/${id}/socials`, {
            method: "PUT",
            body: JSON.stringify({
                githubUrl,
            }),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    static async getLeaderboard() {
        try {
            let leaderboard = await fetch(`${PUBLIC_API_URL}/ctf/leaderboard`);
            return await leaderboard.json();
        } catch(e) {
            return {}
        }
    }

    /**
     * @param {string} id
     */
    static async getUserRank(id) {
        let index = await fetch(`${PUBLIC_API_URL}/user/${id}/rank`);
        if (index.status != 200) {
            return -1;
        } else {
            return Number(await index.text());
        }
    }

    /**
     * @param {string} id
     */
    static async getUser(id) {
        let user = await fetch(`${PUBLIC_API_URL}/user/${id}`);
        if (user.status != 200) {
            return undefined;
        } else {
            return await user.json();
        }
    }

    /**
     * @param {number} id
     * @param {string} flag
     */
    static async solve(id, flag) {
        let resp = await fetch(`${PUBLIC_API_URL}/ctf/challenge/${id}/solve`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                flag,
            }),
        });

        if (resp.status !== 200) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * @param {number} id
     * @param {string} body
     */
    static async createGuide(id, body) {
        let resp = await fetch(`${PUBLIC_API_URL}/ctf/challenge/${id}/guides`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                body,
            }),
        });

        if (resp.status !== 200) {
            return false;
        } else {
            return true;
        }
    }
}

export { Api };
