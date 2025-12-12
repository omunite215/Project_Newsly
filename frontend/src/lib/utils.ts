import { DateTime } from "luxon";
import { NavLink } from "./types";

export function relativeTime(date: string) {
	const datetime = DateTime.fromISO(date);
	return datetime.toRelative();
}

export const NAV_LINKS: NavLink[] = [
	{ label: "New", to: "/", search: { sortBy: "recent", order: "desc" } },
	{ label: "Top", to: "/", search: { sortBy: "points", order: "desc" } },
	{ label: "Submit", to: "/submit" },
];
