import { object, string, TypeOf } from "zod";

const payloadSchema = object({
  email: string({
    required_error: "Email is required",
  }),
  password: string({
    required_error: "Password is required",
  }),
});

export const loginSchema = object({
  body: payloadSchema,
});

export type LoginInput = TypeOf<typeof loginSchema>;
