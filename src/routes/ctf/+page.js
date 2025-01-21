import { Api } from '$lib/api.js';


export const load = async ({ params, url }) => {
	let page = url.searchParams.get('page');
    let challengeId = url.searchParams.get('challenge');
    let guideId = url.searchParams.get('guide');
    let openGuideEditor = (url.searchParams.get('guideEditor') || "").toLowerCase() == "true";
    return { page, challengeId, guideId, openGuideEditor }
};