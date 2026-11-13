import { z } from "zod";

const EnvSchema = z.object({
	DATABASE_URL: z.string().url(),
});

/**
 * Returns DATABASE_URL with libpq-only params removed.
 * postgres.js forwards unknown query params to the server as runtime
 * settings, so `channel_binding` (added by Neon's copy-paste strings)
 * would make the connection fail.
 */
export function getDatabaseUrl(): string {
	const { DATABASE_URL } = EnvSchema.parse(process.env);
	const url = new URL(DATABASE_URL);
	url.searchParams.delete("channel_binding");
	return url.toString();
}
