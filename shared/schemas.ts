import { z } from "zod";

import { insertCommentsSchema } from "../server/db/schemas/comments";
import { insertPostSchema } from "../server/db/schemas/posts";

// Response/entity types live in ./types.ts; this file holds runtime schemas.

export const loginSchema = z.object({
	username: z
		.string()
		.min(3)
		.max(31)
		.regex(/^[a-zA-Z0-9_]+$/),
	password: z.string().min(3).max(255),
});

export const checkIdSchema = z.object({
	id: z.coerce.number().int().positive(),
});

export const createPostSchema = insertPostSchema
	.pick({
		title: true,
		url: true,
		content: true,
	})
	.refine((data) => data.url || data.content, {
		message: "Either URL or Content must be provided",
		path: ["url", "content"],
	});

export const sortBySchema = z.enum(["points", "recent"]);
export const orderSchema = z.enum(["asc", "desc"]);

export type SortBy = z.infer<typeof sortBySchema>;
export type Order = z.infer<typeof orderSchema>;

export const paginationSchema = z.object({
	limit: z.coerce.number().optional().default(10),
	page: z.coerce.number().optional().default(1),
	sortBy: sortBySchema.optional().default("points"),
	order: orderSchema.optional().default("desc"),
	author: z.optional(z.string()),
	site: z.string().optional(),
});

export const createCommentSchema = insertCommentsSchema.pick({ content: true });
