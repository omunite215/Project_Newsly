import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import type { ErrorResponse } from "../shared/types";
import type { Context } from "./context";
import { lucia } from "./lucia";
import { authRouter } from "./routes/auth";
import { commentsRouter } from "./routes/comments";
import { postRouter } from "./routes/posts";

const app = new Hono<Context>();

app.use("*", cors(), async (c, next) => {
	const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
	if (!sessionId) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session?.fresh) {
		c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
			append: true,
		});
	}
	if (!session) {
		c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
			append: true,
		});
	}
	c.set("session", session);
	c.set("user", user);
	return next();
});

const routes = app
	.basePath("/api")
	.get("/health", (c) => c.json({ status: "ok" }))
	.route("/auth", authRouter)
	.route("/posts", postRouter)
	.route("/comments", commentsRouter);

// Unknown API paths get a JSON 404 instead of falling through to the SPA.
app.all("/api/*", (c) =>
	c.json<ErrorResponse>({ success: false, error: "Not Found" }, 404),
);

// Production: serve the built frontend (frontend/dist) from the same origin,
// with index.html as the fallback for client-side routes.
app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

app.onError((err, c) => {
	if (err instanceof HTTPException) {
		const errResponse =
			err.res ??
			c.json<ErrorResponse>(
				{
					success: false,
					error: err.message,
					isFormError:
						err.cause && typeof err.cause === "object" && "form" in err.cause
							? err.cause.form === true
							: false,
				},
				err.status,
			);
		return errResponse;
	}
	return c.json<ErrorResponse>(
		{
			success: false,
			error:
				Bun.env.NODE_ENV === "production"
					? "Internal Server Error"
					: (err.stack ?? err.message),
		},
		500,
	);
});
export default app;
export type ApiRoutes = typeof routes;
