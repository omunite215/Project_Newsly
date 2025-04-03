import { sql, type SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { type ObjectSchema, object } from "valibot";

export const getISOFormatDateQuery = (dateTimeColumn: PgColumn): SQL<string> =>
	sql<string>`to_char(${dateTimeColumn}, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function pick<
	T extends ObjectSchema<any, any>,
	K extends keyof T["entries"],
>(schema: T, keys: K[]) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const pickedEntries: Record<string, any> = {};
	for (const key of keys) {
		const keyStr = key as string;
		if (schema.entries[keyStr]) {
			pickedEntries[keyStr] = schema.entries[keyStr];
		}
	}

	return object(pickedEntries);
}
