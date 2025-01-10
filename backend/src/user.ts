import { Elysia, error, t } from "elysia";
import { authentication } from "./authentication";
import { Ctf } from "./ctf/client";
import { db, DBStatus } from "./drizzle";

const userPlugin = new Elysia({ name: "user" })
    .use(authentication)
    .decorate("ctf", new Ctf(db))
    .get(
        "/user/:id",
        async ({ ctf, params: { id } }) => {
            let user = await ctf.getUser(id);
            if (user === DBStatus.NonExistantError) {
                return error(404, "Who's there?");
            }
            return user;
        },
        {
            params: t.Object({
                id: t.String(),
            }),
            response: {
                404: t.String(),
                200: t.Object({
                    id: t.String(),
                    name: t.String(),
                    score: t.Number(),
                    image: t.Nullable(t.String()),
                    githubUrl: t.Nullable(t.String()),
                }),
            },
        }
    )
    .put(
        "/user/:id/socials",
        async ({ ctf, params: { id }, body }) => {
            let user = await ctf.updateUserSocials(id, body);
            if (user === DBStatus.NonExistantError) {
                return error(404, "Who's there?");
            }
            return user;
        },
        {
            params: t.Object({
                id: t.String(),
            }),
            body: t.Object({
                githubUrl: t.Optional(t.String()),
            }),
            response: {
                404: t.String(),
                200: t.Object({
                    id: t.String(),
                    name: t.String(),
                    score: t.Number(),
                    image: t.Nullable(t.String()),
                    githubUrl: t.Nullable(t.String()),
                }),
                401: t.String()
            },
            signinProtected: true
        }
    )
    .get("/user/:id/rank", async ({ctf, params: { id }}) => {
        let leaderboard = await ctf.leaderboard();
        let index = leaderboard.findIndex(x => x.id == id);
        if (index < 0) {
            return error(418, "You don't exist bozo");
        };
        return index+1
    }, {
        params: t.Object({
            id: t.String()
        }),
        response: {
            200: t.Integer(),
            418: t.String()
        }
    });

export { userPlugin };
