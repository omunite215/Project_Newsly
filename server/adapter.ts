import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as v from "valibot";
import { sessionTable, userRelations, userTable } from "./db/schemas/auth";
import { postsRelations, postsTable } from "./db/schemas/posts";
import { commentRelations, commentsTable } from "./db/schemas/comments";
import {
	commentUpvoteRelations,
	commentUpvotesTable,
	postUpvoteRelations,
	postUpvotesTable,
} from "./db/schemas/upvotes";

const EnvSchema = v.object({
	DATABASE_URL: v.pipe(v.string(), v.url("URL is badly formatted")),
});

const processEnv = v.parse(EnvSchema, Bun.env);
const queryClient = postgres(processEnv.DATABASE_URL);
export const db = drizzle(queryClient, {
	schema: {
		user: userTable,
		session: sessionTable,
		posts: postsTable,
		comments: commentsTable,
		postUpvotes: postUpvotesTable,
		commentUpvotes: commentUpvotesTable,
		postsRelations,
		commentUpvoteRelations,
		postUpvoteRelations,
		userRelations,
		commentRelations,
	},
});
export const adapter = new DrizzlePostgreSQLAdapter(
	db,
	sessionTable,
	userTable,
);
