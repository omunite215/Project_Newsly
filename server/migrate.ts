import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { getDatabaseUrl } from "./db/url";

// Applies pending SQL migrations from ./drizzle. Safe to run on every boot:
// already-applied migrations are tracked and skipped.
const client = postgres(getDatabaseUrl(), { max: 1 });
await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
await client.end();
console.log("Migrations applied");
