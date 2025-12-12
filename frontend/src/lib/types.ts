import { type ReactNode, type SetStateAction, type Dispatch } from "react";
import {
	type LinkProps as MuiLinkProps,
	type ButtonProps as MuiButtonProps,
} from "@mui/material";
import { Comment } from "@/shared/types";
import { useUpvoteComment } from "./api-hooks";

export type NavLink = {
	label: string;
	to: string;
	search?: Record<string, any>;
};

export type HeaderProps = {
	window?: () => Window;
	children: ReactNode;
};

export type LinkVariant =
	| "default"
	| "subtle"
	| "highlight"
	| "tonal"
	| "elevated"
	| "filled";

export interface BaseNavigationProps {
	loading?: boolean;
	disableAnimation?: boolean;
	iconStart?: ReactNode;
	iconEnd?: ReactNode;
}

export interface CustomLinkOwnProps
	extends Omit<MuiLinkProps, "href" | "ref">,
		BaseNavigationProps {
	linkVariant?: LinkVariant;
}

export interface CustomButtonLinkProps
	extends Omit<MuiButtonProps, "href" | "ref" | "loading">,
		BaseNavigationProps {}

export type Mode = "light" | "dark" | "system";

export type ColorModeContextType = {
	mode: Mode;
	setMode: (mode: Mode) => void;
};

export type ThemeSwitchProps = {
	floating?: boolean;
	showAutoMode?: boolean;
	size?: "small" | "medium" | "large";
	className?: string;
};

export type SwitchContainerProps = {
	floating?: boolean;
};

export type RayProps = {
	index: number;
	total: number;
};

export type ModeIndicatorProps = {
	active?: boolean;
	mode: "light" | "dark" | "auto";
};

export type CommentCardProps = {
	comment: Comment;
	depth: number;
	activeReplyId: number | null;
	setActiveReplyId: Dispatch<SetStateAction<number | null>>;
	isLast: boolean;
	toggleUpvote: ReturnType<typeof useUpvoteComment>["mutate"];
};
