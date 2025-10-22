import { db } from "@/adapter";
import type { Context } from "@/context";
import { commentsTable } from "@/db/schemas/comments";
import { postsTable } from "@/db/schemas/posts";
import { commentUpvotesTable } from "@/db/schemas/upvotes";
import { getISOFormatDateQuery } from "@/lib/utils";
import { loggedIn } from "@/middleware/loggedIn";
import {
  checkIdSchema,
  createCommentSchema,
  paginationSchema,
} from "@/shared/schemas";
import type {
  Comment,
  PaginatedResponse,
  SuccessResponse,
} from "@/shared/types";
import { zValidator } from "@hono/zod-validator";
import { and, asc, countDistinct, desc, eq, isNull, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { User } from "lucia";

export const commentsRouter = new Hono<Context>()
  .post(
    "/:id",
    loggedIn,
    zValidator("param", checkIdSchema),
    zValidator("form", createCommentSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const { content } = c.req.valid("form");
      const user = c.get("user") as User;
      const [comment] = await db.transaction(async (tx) => {
        const [parentComment] = await db
          .select({
            id: commentsTable.id,
            postId: commentsTable.postId,
            depth: commentsTable.depth,
          })
          .from(commentsTable)
          .where(eq(commentsTable.id, id))
          .limit(1);
        if (!parentComment) {
          throw new HTTPException(404, { message: "Comment not found." });
        }
        const postId = parentComment.postId;
        const [updateParentComment] = await tx
          .update(commentsTable)
          .set({
            commentCount: sql`${commentsTable.commentCount} + 1`,
          })
          .where(eq(commentsTable.id, parentComment.id))
          .returning({ commentCount: commentsTable.commentCount });
        const [updatedPost] = await tx
          .update(postsTable)
          .set({
            commentCount: sql`${postsTable.commentCount} + 1`,
          })
          .where(eq(postsTable.id, postId))
          .returning({ commentCount: postsTable.commentCount });
        if (!updatedPost) {
          throw new HTTPException(404, { message: "Error creating comment." });
        }
        return await tx
          .insert(commentsTable)
          .values({
            content,
            userId: user.id,
            postId: postId,
            parentCommentId: parentComment.id,
            depth: parentComment.depth + 1,
          })
          .returning({
            id: commentsTable.id,
            userId: commentsTable.userId,
            postId: commentsTable.postId,
            content: commentsTable.content,
            points: commentsTable.points,
            depth: commentsTable.depth,
            parentCommentId: commentsTable.parentCommentId,
            createdAt: getISOFormatDateQuery(commentsTable.createdAt).as(
              "created_at"
            ),
            commentCount: commentsTable.commentCount,
          });
      });
      return c.json<SuccessResponse<Comment>>({
        success: true,
        message: "Comment created",
        data: {
          ...comment,
          childComments: [],
          commentUpvotes: [],
          author: {
            username: user.username,
            id: user.id,
          },
        } as Comment,
      });
    }
  )
  .post(
    "/:id/upvote",
    loggedIn,
    zValidator("param", checkIdSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = c.get("user") as User;
      let pointsChange: -1 | 1 = 1;
      const points = await db.transaction(async (tx) => {
        //EP
        const [existingUpvote] = await db
          .select()
          .from(commentUpvotesTable)
          .where(
            and(
              eq(commentUpvotesTable.commentId, id),
              eq(commentUpvotesTable.userId, Number(user.id))
            )
          )
          .limit(1);
        pointsChange = existingUpvote ? -1 : 1;
        const [updated] = await tx
          .update(commentsTable)
          .set({ points: sql`${commentsTable.points} + ${pointsChange}` })
          .where(eq(commentsTable.id, id))
          .returning({ points: commentsTable.points });
        if (!updated) {
          throw new HTTPException(404, { message: "Comment not Found." });
        }
        if (existingUpvote) {
          await tx
            .delete(commentUpvotesTable)
            .where(eq(commentUpvotesTable.id, existingUpvote.id));
        } else {
          // EP
          await tx
            .insert(commentUpvotesTable)
            .values({ commentId: id, userId: Number(user.id) });
        }
        return updated.points;
      });
      return c.json<
        SuccessResponse<{ count: number; commentUpvotes: { userId: string }[] }>
      >(
        {
          success: true,
          message: "Comment updated successfully",
          data: {
            count: points,
            commentUpvotes: pointsChange === 1 ? [{ userId: user.id }] : [],
          },
        },
        200
      );
    }
  )
  .get(
    "/:id/comments",
    zValidator("param", checkIdSchema),
    zValidator("query", paginationSchema),
    async (c) => {
      const user = c.get("user") as User;
      const { id } = c.req.valid("param");
      const { limit, page, sortBy, order } = c.req.valid("query");
      const offset = (page - 1) * limit;
      const sortByColumn =
        sortBy === "points" ? commentsTable.points : commentsTable.createdAt;
      const sortOrder =
        order === "desc" ? desc(sortByColumn) : asc(sortByColumn);

      const [count] = await db
        .select({ count: countDistinct(commentsTable.id) })
        .from(commentsTable)
        .where(eq(commentsTable.parentCommentId, id));

      const comments = await db.query.comments.findMany({
        where: and(
          eq(commentsTable.postId, id),
          isNull(commentsTable.parentCommentId)
        ),
        orderBy: sortOrder,
        limit: limit,
        offset: offset,
        with: {
          author: {
            columns: {
              username: true,
              id: true,
            },
          },
          commentUpvotes: {
            limit: 1,
            columns: { userId: true },
            //EP
            where: eq(commentUpvotesTable.userId, Number(user.id)),
          },
        },
        extras: {
          createdAt: getISOFormatDateQuery(commentsTable.createdAt).as(
            "created_at"
          ),
        },
      });

      return c.json<PaginatedResponse<Comment[]>>({
        success: true,
        message: "Comments fetched.",
        data: comments as unknown as Comment[],
        pagination: {
          page,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          totalPages: Math.ceil(count!.count / limit) as number,
        },
      });
    }
  );
