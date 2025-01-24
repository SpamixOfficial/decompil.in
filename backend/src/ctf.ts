import { Elysia, error, t } from "elysia";
import { Ctf } from "./ctf/client";
import { db, DBStatus } from "./drizzle";
import bearer from "@elysiajs/bearer";
import { authentication } from "./authentication";
import { auth } from "./utils/auth";

export const ctfPlugin = new Elysia({ prefix: "ctf", name: "ctf" })
    .use(authentication)
    .use(bearer())
    .decorate("ctf", new Ctf(db))
    .model({
        challengeObjectInternal: t.Object(
            {
                title: t.String(),
                description: t.String(),
                flag: t.String(),
                score: t.Integer(),
                files: t.Array(t.String()),
                solves: t.Integer(),
                category: t.Nullable(
                    t.Enum({
                        misc: "misc",
                        pwn: "pwn",
                        rev: "rev",
                        crypto: "crypto",
                        osint: "osint",
                        web: "web",
                    })
                ),
            },
            {
                $id: "#/components/schemas/challenge.internal",
            }
        ),
        challengeObjectInternalPost: t.Object(
            {
                title: t.String(),
                description: t.String(),
                flag: t.String(),
                score: t.Integer(),
                files: t.Array(t.String()),
                category: t.Nullable(
                    t.Enum({
                        misc: "misc",
                        pwn: "pwn",
                        rev: "rev",
                        crypto: "crypto",
                        osint: "osint",
                        web: "web",
                    })
                ),
            },
            {
                $id: "#/components/schemas/challenge.internal",
            }
        ),
        challengeObjectInternalUpdate: t.Object(
            {
                title: t.Optional(t.String()),
                description: t.Optional(t.String()),
                flag: t.Optional(t.String()),
                score: t.Optional(t.Integer()),
                files: t.Optional(t.Array(t.String())),
                category: t.Nullable(
                    t.Enum({
                        misc: "misc",
                        pwn: "pwn",
                        rev: "rev",
                        crypto: "crypto",
                        osint: "osint",
                        web: "web",
                    })
                ),
            },
            {
                $id: "#/components/schemas/challenge-update.internal",
            }
        ),
        challengeObject: t.Object(
            {
                id: t.Integer(),
                title: t.String(),
                description: t.String(),
                score: t.Integer(),
                files: t.Array(t.Ref("#/components/schemas/challenge-files.file")),
                solves: t.Integer(),
                category: t.Nullable(
                    t.Enum({
                        misc: "misc",
                        pwn: "pwn",
                        rev: "rev",
                        crypto: "crypto",
                        osint: "osint",
                        web: "web",
                    })
                ),
            },
            {
                $id: "#/components/schemas/challenge",
            }
        ),
        challengeObjectExternal: t.Object(
            {
                id: t.Integer(),
                title: t.String(),
                description: t.String(),
                score: t.Integer(),
                files: t.Array(t.Ref("#/components/schemas/challenge-files.file")),
                solved: t.Boolean(),
                solves: t.Integer(),
                category: t.Nullable(
                    t.Enum({
                        misc: "misc",
                        pwn: "pwn",
                        rev: "rev",
                        crypto: "crypto",
                        osint: "osint",
                        web: "web",
                    })
                ),
            },
            {
                $id: "#/components/schemas/challenge.external",
            }
        ),
        challengeFile: t.Object(
            {
                id: t.Integer(),
                url: t.String(),
                challengeId: t.Integer(),
            },
            {
                $id: "#/components/schemas/challenge-files.file",
            }
        ),
        statusResponse: t.Object({
            message: t.String(),
        }),
    })
    .get(
        "/challenges",
        async ({ ctf, request }) => {
            const session = await auth.api.getSession({ headers: request.headers });
            let userId = undefined;
            if (session) {
                userId = session.user.id;
            }

            let result = await ctf.getChallenges(userId);
            return result;
        },
        {
            response: t.Array(t.Ref("#/components/schemas/challenge.external")),
        }
    )
    .post(
        "/challenges",
        async ({ ctf, body }) => {
            let result = await ctf.createChallenge(body);

            if (result === DBStatus.NonExistantError) {
                return error(404, "Something went wrong when creating the challenge");
            } else if (result === undefined) {
                return error(400, "Unknown error, consult the administrator");
            }
            return result;
        },
        {
            protected: true,
            body: "challengeObjectInternalPost",
            response: {
                200: "challengeObject",
                401: t.String(),
                404: t.String(),
                400: t.String(),
            },
        }
    )
    .get(
        "/challenge/:id",
        async ({ ctf, params: { id }, request }) => {
            const session = await auth.api.getSession({ headers: request.headers });
            let solved = false;
            let result = await ctf.getChallenge(id);
            if (result === DBStatus.NonExistantError) {
                return error(404, "No such challenge");
            }

            if (session) {
                let userId = session.user.id;
                solved = await ctf.hasUserSolvedChall({userId, challId: id})
            }

            return {...result, solved};
        },
        {
            params: t.Object({
                id: t.Number(),
            }),
            response: {
                200: "challengeObjectExternal",
                404: t.String(),
            },
        }
    )
    .put(
        "/challenge/:id",
        async ({ ctf, body, params: { id } }) => {
            let chall = await ctf.updateChallenge(id, body);

            if (chall === DBStatus.NonExistantError) {
                return error(404, "No such challenge");
            }

            return chall;
        },
        {
            params: t.Object({
                id: t.Number(),
            }),
            protected: true,
            body: "challengeObjectInternalUpdate",
            response: {
                200: "challengeObject",
                401: t.String(),
                404: t.String(),
            },
        }
    )
    .post(
        "/challenge/:id/solve",
        async ({ request, ctf, body, params: { id } }) => {
            let chall = await ctf.getChallenge(id);

            if (chall === DBStatus.NonExistantError) {
                return error(404, "No such challenge");
            }

            if ((await ctf.checkChallFlag(id, body.flag)) !== true) {
                return error(418, "Teapots can't solve challenges :3");
            }

            let userId = (await auth.api.getSession({ headers: request.headers }))!.user.id;

            let result = await ctf.createSolve({ challId: id, userId });
            if (result === DBStatus.NotValidError) {
                return error(401, "Look at this phony trying to solve challenges more than once >.<");
            }

            await ctf.awardPoints(userId, chall.score);

            return "Success";
        },
        {
            params: t.Object({
                id: t.Number(),
            }),
            signinRequired: true,
            body: t.Object({
                flag: t.String(),
            }),
            response: {
                200: t.String(),
                401: t.String(),
                418: t.String(),
                404: t.String(),
            },
        }
    )
    .get(
        "/challenge/:id/guides",
        async ({ ctf, params: { id } }) => {
            if ((await ctf.getChallenge(id)) === DBStatus.NonExistantError) {
                return error(404, "You don't exist :3");
            }
            let guides = await ctf.getGuides(id);

            return guides;
        },
        {
            params: t.Object({
                id: t.Number(),
            }),
            response: {
                200: t.Array(
                    t.Object({
                        id: t.Number(),
                        body: t.String(),
                        userId: t.String(),
                    })
                ),
                404: t.String(),
            },
        }
    )
    .get(
        "/guides/unapproved",
        async ({ ctf }) => {
            let guides = await ctf.getUnapprovedGuides();
            return guides;
        },
        {
            response: {
                200: t.Array(
                    t.Object({
                        id: t.Number(),
                        body: t.String(),
                        userId: t.String(),
                    })
                ),
                401: t.String(),
            },
            protected: true,
        }
    )
    .get(
        "/guides",
        async ({ ctf }) => {
            let guides = await ctf.getAllGuides();
            return guides;
        },
        {
            response: {
                200: t.Array(
                    t.Object({
                        id: t.Number(),
                        body: t.String(),
                        userId: t.String(),
                    })
                ),
                401: t.String(),
            },
            protected: true,
        }
    )
    .get(
        "/guides/approved",
        async ({ ctf }) => {
            let guides = await ctf.getAllApprovedGuides();
            return guides;
        },
        {
            response: {
                200: t.Array(
                    t.Object({
                        id: t.Number(),
                        body: t.String(),
                        userId: t.String(),
                        createdAt: t.Date(),
                        user: t.Any(),
                        challenge: t.Any(),
                    })
                ),
                401: t.String(),
            },
            protected: true,
        }
    )
    .get(
        "/guides/:id",
        async ({ ctf, params: { id } }) => {
            let guide = await ctf.getGuide(id);
            if (guide === DBStatus.NonExistantError) {
                return error(404, "No such guide :(");
            }
            return guide;
        },
        {
            params: t.Object({
                id: t.Number(),
            }),
            response: {
                200: t.Object({
                    id: t.Number(),
                    body: t.String(),
                    userId: t.String(),
                    createdAt: t.Date(),
                }),
                404: t.String(),
                401: t.String(),
            },
        }
    )
    .post(
        "/guides/:id/unapprove",
        async ({ ctf, params: { id } }) => {
            let guide = await ctf.getGuide(id);
            if (guide === DBStatus.NonExistantError) {
                return error(404, "No such guide :(");
            }
            await ctf.unApproveGuide(id);
        },
        {
            params: t.Object({
                id: t.Number(),
            }),
            response: {
                404: t.String(),
                401: t.String(),
            },
            protected: true,
        }
    )
    .delete(
        "/guides/:id",
        async ({ ctf, params: { id } }) => {
            await ctf.deleteGuide(id);
        },
        {
            params: t.Object({
                id: t.Number(),
            }),
            response: {
                404: t.String(),
                401: t.String(),
            },
            protected: true,
        }
    )
    .post(
        "/challenge/:id/guides",
        async ({ ctf, request, body, params: { id } }) => {
            const session = await auth.api.getSession({ headers: request.headers });
            
            let challenge = await ctf.getChallenge(id);
            if (challenge === DBStatus.NonExistantError) {
                return error(404, "No such challenge :(");
            }
            
            let userId = session?.user.id!;
            // user shouldn't be able to write guides if they haven't solved the challenge first
            let hasUserSolved = await ctf.hasUserSolvedChall({userId, challId: id})
            if (!hasUserSolved) {
                return error(401, "Nuh uh, solve this before trying to write guides");
            }
            await ctf.createGuide({ challId: id, userId, body: body.body });
        },
        {
            params: t.Object({
                id: t.Number(),
            }),
            body: t.Object({
                body: t.String(),
            }),
            response: {
                404: t.String(),
                401: t.String(),
            },
            signinRequired: true,
        }
    )
    .post(
        "/challenge/:id/guides/:guideId/approve",
        async ({ ctf, params: { id, guideId } }) => {
            if ((await ctf.getChallenge(id)) === DBStatus.NonExistantError) {
                return error(404, "You don't exist :3");
            }
            await ctf.approveGuide(guideId);
        },
        {
            params: t.Object({
                id: t.Number(),
                guideId: t.Number(),
            }),
            response: {
                404: t.String(),
            },
            protected: true,
        }
    )
    .get(
        "/leaderboard",
        async ({ ctf }) => {
            let leaderboard = await ctf.leaderboard();
            return leaderboard;
        },
        {
            response: t.Array(
                t.Object({
                    id: t.String(),
                    name: t.String(),
                    score: t.Number(),
                    image: t.Nullable(t.String()),
                    githubUrl: t.Nullable(t.String()),
                })
            ),
        }
    );
