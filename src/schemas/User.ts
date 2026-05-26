import { z } from "zod";

export const UserSchema = z.object({
  email: z.email({ error: () => ({ message: "validation.emailInvalid" }) }),
  firstname: z
    .string()
    .min(1, { error: () => ({ message: "validation.required" }) }),
  lastname: z
    .string()
    .min(1, { error: () => ({ message: "validation.required" }) }),
  password: z
    .string()
    .min(8, { error: () => ({ message: "validation.passwordMin" }) }),
});

export type User = z.infer<typeof UserSchema>;

export const LoginSchema = UserSchema.pick({
  email: true,
  password: true,
});

export type Login = z.infer<typeof LoginSchema>;
