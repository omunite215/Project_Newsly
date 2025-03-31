export type SuccessResponse<T = void> = {
	success: true;
	message: string;
} & (T extends void ? Record<string, never> : { data: T });

export type ErrorResponse = {
	success: false;
	error: string;
	isFormError?: boolean;
};
