// DEPRECATED IN FAVOR OF NEW BACKEND!


import { redirect } from "@sveltejs/kit";
import {
    SPOTIFY_TOKEN,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_CLIENT_ID,
    SETUP_PWD,
    CALLBACK,
} from "$env/static/private";

import queryString from "querystring";

async function GET({ request }) {
    // Return to main page if spotify thingy is already set up
    if (SPOTIFY_TOKEN) {
        return redirect(302, "/");
    }
    let params = new URL(request.url).searchParams;

    if (params.has("setup_auth")) {
        let auth = params.get("setup_auth");
        // pwd protect setup, we dont want a random dudes spotify on here lmfao
        if (auth != SETUP_PWD) {
            return redirect(302, "/");
        }
    }

    // if not response from spotify callback most likely its a first setup request, or just a haxxorman trying to find some vulnerable url
    if (!params.has("code")) {
        redirect(
            302,
            `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${CALLBACK}&scope=user-read-currently-playing`
        );
        return redirect(302, "/");
    }

    let code = params.get("code");
    console.log(code);
    let resp = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body: queryString.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: CALLBACK,
        }),
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization:
                "Basic " +
                new Buffer.from(
                    SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
                ).toString("base64"),
        },
        json: true,
    });
    let jsresp = await resp.json();
    console.log(resp);
    return new Response(
        `Go ahead and add this token to your .env file, and you'll be done!\n\nToken: ${jsresp.refresh_token}`
    );
}
