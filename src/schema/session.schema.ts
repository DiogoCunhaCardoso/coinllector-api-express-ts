import { object, string, TypeOf } from "zod";

const payloadSchema = object({
  email: string({
    required_error: "Email is required",
  }),
  password: string({
    required_error: "Password is required",
  }),
});

export const createSessionSchema = object({
  body: payloadSchema,
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>;
