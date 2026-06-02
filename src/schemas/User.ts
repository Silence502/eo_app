import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.email({ error: () => ({ message: "validation.emailInvalid" }) }),
  firstName: z
    .string()
    .min(1, { error: () => ({ message: "validation.required" }) }),
  lastName: z
    .string()
    .min(1, { error: () => ({ message: "validation.required" }) }),
  password: z
    .string()
    .min(8, { error: () => ({ message: "validation.passwordMin" }) }),
  role: z.enum(["user", "admin"]).default("user"),
  plan: z.enum(["free", "pro", "enterprise"]).default("free"),
  hashedRefreshToken: z.string().optional(),
  createdAt: z.date().readonly(),
  updatedAt: z.date().readonly(),
});

export type User = z.infer<typeof UserSchema>;

export const LoginSchema = UserSchema.pick({
  email: true,
  password: true,
});

const RegisterBaseSchema = UserSchema.pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
}).extend({
  confirmPassword: z
    .string()
    .min(1, { error: () => ({ message: "validation.required" }) }),
  termsAccepted: z.boolean().refine(value => value === true, {
    error: () => ({ message: "validation.termsAccepted" }),
  }),
  privacyAccepted: z.boolean().default(false),
  marketingAccepted: z.boolean().default(false),
  consentVersion: z.string().optional(),
  language: z
    .string()
    .default(() => {
      const lang =
        typeof navigator !== "undefined"
          ? (navigator.language.split("-")[0] ?? "en")
          : "en";
      return ["en", "fr"].includes(lang) ? lang : "en";
    })
    .refine(lang => ["en", "fr"].includes(lang), {
      error: () => ({ message: "validation.languageInvalid" }),
    }),
  timezone: z.string().default(() => {
    return (
      (typeof Intl !== "undefined" &&
        Intl.DateTimeFormat().resolvedOptions().timeZone) ||
      "UTC"
    );
  }),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  receiveNotifications: z.boolean().default(true),
  receiveReminders: z.boolean().default(true),
});

export const RegisterSchema = RegisterBaseSchema.refine(
  data => data.password === data.confirmPassword,
  {
    message: "validation.passwordConfirmMismatch",
    path: ["confirmPassword"],
    when(payload) {
      return RegisterBaseSchema.pick({
        password: true,
        confirmPassword: true,
      }).safeParse(payload.value).success;
    },
  },
);

export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
