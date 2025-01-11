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
            },
            {
                $id: "#/components/schemas/challenge-update.internal",
            }
        ),
        challengeObjectExternal: t.Object(
            {
                id: t.Integer(),
                title: t.String(),
                description: t.String(),
                score: t.Integer(),
                files: t.Array(t.Ref("#/components/schemas/challenge-files.file")),
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
        async ({ ctf }) => {
            let result = await ctf.getChallenges();
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
            body: "challengeObjectInternal",
            response: {
                200: "challengeObjectExternal",
                401: t.String(),
                404: t.String(),
                400: t.String(),
            },
        }
    )
    .get(
        "/challenge/:id",
        async ({ ctf, params: { id } }) => {
            let result = await ctf.getChallenge(id);
            if (result === DBStatus.NonExistantError) {
                return error(404, "No such challenge");
            }
            return result;
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
                200: "challengeObjectExternal",
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
                return error(418, "Teapots can't solve challenges :3")
            }

            let userId = (await auth.api.getSession({ headers: request.headers }))!.user.id;

            await ctf.createSolve({ challId: id, userId });

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
                401: t.String()
            },
            protected: true
        }
    )
    .post(
        "/challenge/:id/guides/:challId/approve",
        async ({ ctf, params: { id, challId } }) => {
            if ((await ctf.getChallenge(id)) === DBStatus.NonExistantError) {
                return error(404, "You don't exist :3");
            }
            await ctf.approveGuide(challId);
        },
        {
            params: t.Object({
                id: t.Number(),
                challId: t.Number(),
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
