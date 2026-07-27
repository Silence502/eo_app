import { z } from "zod";

export const SettingsSchema = z.object({
  timezone: z.string().optional(),
  notificationsEmail: z
    .preprocess(
      v => (typeof v === "string" ? v === "true" || v === "1" : v),
      z.boolean({ error: "validation.booleanInvalid" }),
    )
    .optional()
    .default(true),
  notificationsSms: z
    .preprocess(
      v => (typeof v === "string" ? v === "true" || v === "1" : v),
      z.boolean({ error: "validation.booleanInvalid" }),
    )
    .optional()
    .default(false),
});

export type UserSettings = z.infer<typeof SettingsSchema>;
