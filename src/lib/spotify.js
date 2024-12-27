export async function fetchData() {
    let playin = await fetch("http://localhost:3000/whatamiplayin");
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