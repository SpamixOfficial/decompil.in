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
}

export { Api };
