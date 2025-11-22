// Shim modules/types that aren't provided by @cloudflare/workers-types module exports

declare module 'cloudflare:workers' {
	export * from '@cloudflare/workers-types';
}

declare module 'cloudflare:ai' {
	// Minimal placeholder until proper types are available
	export type AIGatewayProviders = string;
}
