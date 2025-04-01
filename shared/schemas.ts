import * as v from "valibot";

export const loginSchema = v.object({
    username: v.pipe(v.string(), v.minLength(3), v.maxLength(31), v.regex(/[a-zA-Z0-9_]+$/)),
    password: v.pipe(v.string(), v.minLength(3), v.maxLength(255))
})