import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as v from "valibot";
import { sessionTable, userTable } from "./db/schemas/auth";

const EnvSchema = v.object({
	DATABASE_URL: v.pipe(v.string(), v.url("URL is badly formatted")),
});

const processEnv = v.parse(EnvSchema, Bun.env);
const queryClient = postgres(processEnv.DATABASE_URL);
export const db = drizzle(queryClient, {
	schema: {
		user: userTable,
		session: sessionTable,
	},
});
export const adapter = new DrizzlePostgreSQLAdapter(
	db,
	sessionTable,
	userTable,
);
