import { z } from "zod";

const emptyToNull = (val: unknown) => (val === "" ? null : val);

export const AddressSchema = z.object({
  street: z.string().nullable(),
  otherStreet: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  zip: z.string().nullable(),
  country: z.string().nullable(),
});

export type Address = z.infer<typeof AddressSchema>;

export const BusinessSchema = z.object({
  name: z.string().nullable(),
  email: z.preprocess(emptyToNull, z.email().nullable()),
  phone: z.string().nullable(),
  website: z.preprocess(emptyToNull, z.url().nullable()),
  vatNumber: z.string().nullable(),
  address: AddressSchema.nullable(),
});

export type Business = z.infer<typeof BusinessSchema>;

export const UserProfileSchema = z.object({
  id: z.number().int(),
  email: z.email({ error: () => ({ message: "validation.emailInvalid" }) }),
  firstName: z
    .string()
    .min(2, { error: () => ({ message: "validation.required" }) }),
  lastName: z
    .string()
    .min(2, { error: () => ({ message: "validation.required" }) }),
  phone: z.string().nullable(),
  role: z.enum(["USER", "ADMIN"]),
  plan: z.enum(["free", "pro", "enterprise"]),
  avatarUrl: z.string().nullable(),
  address: AddressSchema.nullable(),
  business: BusinessSchema.nullable(),
  createdAt: z.date().readonly(),
  updatedAt: z.date().readonly(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const UserProfileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { error: () => ({ message: "validation.required" }) }),
  lastName: z
    .string()
    .min(2, { error: () => ({ message: "validation.required" }) }),
  email: z.email({ error: () => ({ message: "validation.emailInvalid" }) }),
  phone: z.string().nullable(),
  avatarUrl: z.string().nullish(),
  address: AddressSchema.nullable(),
  business: BusinessSchema.nullable(),
});

export type UserProfileForm = z.infer<typeof UserProfileFormSchema>;

export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.email({ error: () => ({ message: "validation.emailInvalid" }) }),
  phone: z.string().nullable(),
  firstName: z
    .string()
    .min(2, { error: () => ({ message: "validation.required" }) }),
  lastName: z
    .string()
    .min(2, { error: () => ({ message: "validation.required" }) }),
  password: z
    .string()
    .min(8, { error: () => ({ message: "validation.passwordMin" }) }),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
  plan: z.enum(["free", "pro", "enterprise"]).default("free"),
  avatarUrl: z.string().nullable(),
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
