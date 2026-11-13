import { drizzle } from "drizzle-orm/postgres-js";

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import postgres from "postgres";

import { sessionTable, userRelations, userTable } from "./db/schemas/auth";
import { commentRelations, commentsTable } from "./db/schemas/comments";
import { postsRelations, postsTable } from "./db/schemas/posts";
import {
	commentUpvoteRelations,
	commentUpvotesTable,
	postUpvoteRelations,
	postUpvotesTable,
} from "./db/schemas/upvotes";
import { getDatabaseUrl } from "./db/url";

const queryClient = postgres(getDatabaseUrl());
export const db = drizzle(queryClient, {
	schema: {
		user: userTable,
		session: sessionTable,
		posts: postsTable,
		comments: commentsTable,
		postUpvotes: postUpvotesTable,
		commentUpvoted: commentUpvotesTable,
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
