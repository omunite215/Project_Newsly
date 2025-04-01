import { Lucia } from "lucia";
import { adapter } from "./adapter";

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			sameSite: "strict",
			secure: Bun.env.NODE_ENV === "production",
		},
	},
	getUserAttributes: (att) => {
		return { username: att.username };
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: { username: string };
	}
}
