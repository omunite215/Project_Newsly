import { commentsTable } from "@/db/schemas/comments";
import { postsTable } from "@/db/schemas/posts";
import { pick } from "@/lib/utils";
import { createInsertSchema } from "drizzle-valibot";
import * as v from "valibot";

export const loginSchema = v.object({
	username: v.pipe(
		v.string(),
		v.minLength(3),
		v.maxLength(31),
		v.regex(/[a-zA-Z0-9_]+$/),
	),
	password: v.pipe(v.string(), v.minLength(3), v.maxLength(255)),
});

// @/db/schemas/posts
export const insertPostSchema = createInsertSchema(postsTable, {
	title: v.pipe(v.string(), v.minLength(3, "Title must be atleast 3 chars.")),
	url: v.union([v.pipe(v.string(), v.trim(), v.url()), v.literal("")]),
	content: v.union([v.pipe(v.string(), v.trim()), v.literal("")]),
});

export const createPostSchema = pick(insertPostSchema, [
	"title",
	"url",
	"content",
]);

export const sortBySchema = v.picklist(["points", "recent"] as const);
export const orderSchema = v.picklist(["asc", "desc"] as const);

export const paginationSchema = v.object({
	limit: v.optional(v.number(), 10),
	page: v.optional(v.number(), 1),
	sortBy: v.optional(sortBySchema, "points"),
	order: v.optional(orderSchema, "desc"),
	author: v.optional(v.string()),
	site: v.optional(v.string()),
});

export const checkIdSchema = v.object({
	id: v.number(),
});

// @/db/schemas/comments
export const insertCommentSchema = createInsertSchema(commentsTable, {
	content: v.pipe(
		v.string(),
		v.nonEmpty("Content must be provided"),
		v.minLength(3, "Comment must be atleast 3 Chars."),
	),
});

export const createCommentSchema = pick(insertCommentSchema, ["content"]);

export const commentPaginationSchema = v.object({
	...paginationSchema.entries,
	includeChildren: v.optional(v.boolean())
})