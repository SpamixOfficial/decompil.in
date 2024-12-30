import { Elysia, t } from "elysia";
import { Ctf } from "./ctf/client";
import { db } from "./drizzle";
// (length) => { let l = ""; let a = 0; while (a<length) { let b = Math.random().toString(36).substr(2); a += b.length; l = l + b; console.log(a); }; return l.substr(0, length) }

export const ctfPlugin = new Elysia({ prefix: "ctf"})
    .decorate('ctf', new Ctf(db))
    .get('/challenges', async ({ ctf }) => await ctf.getChallenges(), {
        response: t.Array(t.Object({
            id: t.Integer(),
            title: t.String(),
            description: t.String(),
            score: t.Integer()
        }))
    })
    .post('/challenges', async ({ ctf, body }) => await ctf.createChallenge(body.pwd, body.challenge, body.challengeFiles), {
        body: t.Object({
            pwd: t.String(),
            challenge: t.Object({
                title: t.String(),
                description: t.String(),
                flag: t.String(),
                score: t.Integer()
            }),
            challengeFiles: t.Array(t.String())
        })
    })
