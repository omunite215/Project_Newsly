import { hc, InferResponseType } from "hono/client";

import type { ApiRoutes, ErrorResponse, SuccessResponse } from "@/shared/types";
import { queryOptions } from "@tanstack/react-query";

const client = hc<ApiRoutes>("/", {
	fetch: (input: RequestInfo | URL, init?: RequestInit) =>
		fetch(input, {
			...init,
			credentials: "include",
		}),
}).api;


export const postSignUp = async (username: string, password: string) => {
	try {
		const res = await client.auth.signup.$post({
			form: {
				username,
				password,
			},
		});
		if (res.ok) {
			const data = (await res.json()) as SuccessResponse;
            return data;
		}
        const data = (await res.json()) as unknown as ErrorResponse;
        return data;
	} catch (error) {
        return {
            success: false as const,
            error: String(error),
            isFormError: false,
        } as ErrorResponse;
    }
};
export const postLogin = async (username: string, password: string) => {
	try {
		const res = await client.auth.login.$post({
			form: {
				username,
				password,
			},
		});
		if (res.ok) {
			const data = (await res.json()) as SuccessResponse;
            return data;
		}
        const data = (await res.json()) as unknown as ErrorResponse;
        return data;
	} catch (error) {
        return {
            success: false as const,
            error: String(error),
            isFormError: false,
        } as ErrorResponse;
    }
};

export const getUser = async() => {
	const res = await client.auth.user.$get();
	if (res.ok){
		const data = await res.json();
		return data.data.username;
	}
	return null;
}
export const userQueryOptions = () => queryOptions({
	queryKey: ["user"],
	queryFn: getUser,
	staleTime: Number.POSITIVE_INFINITY
});