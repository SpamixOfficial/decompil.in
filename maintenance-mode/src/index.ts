/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

interface Env {
	MAINTENANCE_STATUS: KVNamespace;
	API_KEY: string;
}

type MaintenanceStatus = {
	outage: boolean;
	message: string;
	started: Date;
	estimated_end?: Date;
};

interface MaintenanceStatusReq {
	outage: boolean;
	message?: string;
	estimated_end?: number;
}

async function get_maintenance(env: Env): Promise<MaintenanceStatus> {
	let status: MaintenanceStatus = {
		outage: false,
		message: '',
		started: new Date(0),
	};
	status.outage = ((await env.MAINTENANCE_STATUS.get('outage')) ?? 'false') == 'true';
	if (!status.outage) {
		return status;
	}

	status.message = (await env.MAINTENANCE_STATUS.get('message')) ?? 'Idk, I have forgotten to set a message :(';
	status.started = new Date(+((await env.MAINTENANCE_STATUS.get('started')) ?? 0));
	let estimated_end: string | null = await env.MAINTENANCE_STATUS.get('estimated_end');
	status.estimated_end = estimated_end !== null ? new Date(+estimated_end) : undefined;

	return status;
}

async function set_maintenance(env: Env, obj: MaintenanceStatusReq): Promise<boolean> {
	if (obj.outage === undefined) {
		return false;
	}

	await env.MAINTENANCE_STATUS.put('outage', obj.outage.toString());
	obj.message && (await env.MAINTENANCE_STATUS.put('message', obj.message));
	obj.estimated_end !== undefined && (await env.MAINTENANCE_STATUS.put('estimated_end', obj.estimated_end.toString()));
	obj.outage && (await env.MAINTENANCE_STATUS.put('started', Date.now().valueOf().toString()));
	return true;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		switch (url.pathname) {
			case '/status':
				if (request.method == 'GET') {
					let resp = await get_maintenance(env);
					return new Response(JSON.stringify(resp), {
						headers: { 'Content-Type': 'application/json' },
					});
				} else if (request.method == "PUT") {
					var auth_header = request.headers.get("Authorization");
					
					if (auth_header == null || auth_header !== env.API_KEY) {
						console.log("nuhuh");
					 	return new Response('Not Found', { status: 404 });
					}


					let body: MaintenanceStatusReq;
					try {
						body = await request.json();
					} catch (_) {
						return new Response('Not Found', { status: 404 });
					}

					let resp = await set_maintenance(env, body);
					return new Response(resp ? "Ok :3" : "nuh", {status: resp ? 200 : 404});
				}
			default:
				return new Response('Not Found', { status: 404 });
		}
	},
} satisfies ExportedHandler<Env>;
