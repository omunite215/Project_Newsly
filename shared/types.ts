export type SuccessResponse<T = void> = {
	success: true;
	message: string;
} & (T extends void ? Record<string, unknown> : { data: T });

export type ErrorResponse = {
	success: false;
	error: string;
	isFormError?: boolean;
};

export type Post = {
	id: number;
	title: string;
	url: string;
	content: string;
	points: number;
	createdAt: string;
	commentCount: number;
	author: {
		id: string;
		username: string;
	};
	isUpvoted: boolean;
};

export type Comment = {
	id: number;
	userId: string;
	content: string;
	points: number;
	depth: number;
	commentCount: number;
	createdAt: string;
	postId: number;
	parentCommentId: number | null;
	commentUpvotes: {
		userId: string;
	}[];
	author: {
		username: string;
		id: string;
	};
	childComments?: Comment[];
};

export type PaginatedResponse<T> = {
	pagination: {
		page: number;
		totalPages: number;
	};
	data: T;
} & Omit<SuccessResponse, "data">;
