import {
    SPOTIFY_TOKEN,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_CLIENT_ID,
} from "$env/static/private";
import queryString from "querystring";


export async function gen_auth() {
    // return access token if refresh is not explicitly needed.
    // Speeds up api call significantly
    if (typeof process.env.TOKEN_REFRESH !== "undefined" && typeof process.env.TOKEN !== "undefined" && process.env.TOKEN_REFRESH > Date.now()) {
        return process.env.TOKEN;
    } else {
        return await refresh_token()
    }
}

async function refresh_token() {
    let resp = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body: queryString.stringify({
            grant_type: "refresh_token",
            refresh_token: SPOTIFY_TOKEN,
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
    process.env.TOKEN_REFRESH = Date.now() + jsresp.expires_in*1000;
    process.env.TOKEN = jsresp.access_token;
    return jsresp.access_token;
}
