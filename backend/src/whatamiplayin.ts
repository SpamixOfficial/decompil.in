import { Elysia, t } from "elysia";
import cron from "@elysiajs/cron";
import queryString from "querystring";

class Playing {
    constructor(
        public is_playing: boolean,
        public title: string,
        public album: string,
        public image_url: string,
        public artists: {
            name: string;
            url: string;
        }[],
        public last_changed: number | null
    ) {}

    static from(data: {
        is_playing: boolean;
        title: string;
        album: string;
        image_url: string;
        artists: {
            name: string;
            url: string;
        }[];
        last_changed: number | null;
    }) {
        return new Playing(
            data.is_playing,
            data.title,
            data.album,
            data.image_url,
            data.artists,
            data.last_changed
        );
    }
}

declare module "bun" {
    interface Env {
        TOKEN_REFRESH: number;
        SPOTIFY_CLIENT_ID: string;
        SPOTIFY_CLIENT_SECRET: string;
        SPOTIFY_DATA: Playing;
    }
}

// This is what actually contacts the spotify api every 2 seconds
async function cronJob() {
    if (!Bun.env.SPOTIFY_TOKEN) {
        return;
    }
    let token = await genAuthTokenSpot();
    let rq = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (rq.status == 204) {
        Bun.env.SPOTIFY_DATA = Playing.from({
            is_playing: false,
            title: "",
            album: "",
            image_url: "",
            artists: [],
            last_changed: null,
        });
        return;
    }
    let song = await rq.json();
    let artists = [];
    for (let artist of song.item.artists) {
        artists.push({ name: artist.name, url: artist.external_urls.spotify });
    }

    Bun.env.SPOTIFY_DATA = Playing.from({
        is_playing: song.is_playing,
        title: song.item.name,
        album: song.item.album.name,
        image_url: song.item.album.images[0].url,
        artists: artists,
        last_changed: song.timestamp,
    });
}

// spotify auth things
async function genAuthTokenSpot() {
    if (
        typeof Bun.env.TOKEN_REFRESH !== "undefined" &&
        typeof Bun.env.TOKEN !== "undefined" &&
        Bun.env.TOKEN_REFRESH > Date.now()
    ) {
        return Bun.env.TOKEN;
    } else {
        return await refreshAuthToken();
    }
}

async function refreshAuthToken() {
    let resp = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body: queryString.stringify({
            grant_type: "refresh_token",
            refresh_token: Bun.env.SPOTIFY_TOKEN,
        }),
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization:
                "Basic " +
                Buffer.from(
                    Bun.env.SPOTIFY_CLIENT_ID +
                        ":" +
                        Bun.env.SPOTIFY_CLIENT_SECRET
                ).toString("base64"),
        },
    });
    let jsresp = await resp.json();
    Bun.env.TOKEN_REFRESH = Date.now() + jsresp.expires_in * 1000;
    Bun.env.TOKEN = jsresp.access_token;
    return jsresp.access_token;
}

// This gets the current playing track from the server storage, it does NOT contact the spotify api
function getPlaying() {
    return Bun.env.SPOTIFY_DATA;
}

export const plugin = new Elysia({ prefix: "whatamiplayin" })
    .use(
        cron({
            name: "getSpotifyStatus",
            pattern: "*/2 * * * * *",
            run() {
                cronJob();
            },
        })
    )
    .get("/", () => getPlaying(), {
        response: t.Object({
            is_playing: t.Boolean(),
            title: t.String(),
            album: t.String(),
            image_url: t.String(),
            artists: t.Array(
                t.Object({
                    name: t.String(),
                    url: t.String(),
                })
            ),
            last_changed: t.Nullable(t.Number()),
        }),
    });
