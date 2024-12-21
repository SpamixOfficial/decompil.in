import { error, json } from "@sveltejs/kit";
import { gen_auth } from "../../lib/server/spotify-auth";

export async function GET() {
    let token = await gen_auth();
    let rq = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (rq.status == 204) {
        return json({
            is_playing: false,
            title: "",
            album: "",
            image_url: "",
            artists: "",
            last_changed: ""
        });
    }


    if (rq.status != 200) {
        console.log(rq, "\n", await rq.text());
        return error(
            500,
            new Error(
                "Something has gone wrong with the spotify playing endpoint, contact the administrator!"
            )
        );
    }

    let song = await rq.json();
    let artists = [];
    for (let artist of song.item.artists) {
        artists.push({ name: artist.name, url: artist.external_urls.spotify });
    }
    
    return json({
        is_playing: song.is_playing,
        title: song.item.name,
        album: song.item.album.name,
        image_url: song.item.album.images[0].url,
        artists: artists,
        last_changed: song.timestamp
    });
}
