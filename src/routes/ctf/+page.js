import { Api } from '$lib/api.js';


export const load = async ({ params, url }) => {
	let page = url.searchParams.get('page');
    let guideId = url.searchParams.get('guide');
    return { page: Number(page), guideId }
};