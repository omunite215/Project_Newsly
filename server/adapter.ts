import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as v from "valibot";

const EnvSchema = v.object({
    DATABASE_URL: v.pipe(v.string(), v.url("URL is badly formatted"))
});

const processEnv = v.parse(EnvSchema, Bun.env);
const queryClient = postgres(processEnv.DATABASE_URL);
const db = drizzle(queryClient);
