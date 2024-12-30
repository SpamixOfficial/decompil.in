import { PUBLIC_API_URL as api_server } from "$env/static/public";

export async function fetchData() {
    let playin = await fetch(`${api_server}/whatamiplayin`);
    let spot_data;
    if (playin.status != 200) {
        spot_data = {
            is_playing: false,
        };
    } else {
        spot_data = await playin.json();
    }
    return spot_data
}