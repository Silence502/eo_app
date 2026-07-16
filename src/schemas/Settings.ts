import { z } from "zod";

export const SettingsSchema = z.object({
  theme: z.enum(["light", "dark"]),
  language: z.enum(["en", "fr"]),
  timezone: z.string().optional(),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
  }),
});

export type UserSettings = z.infer<typeof SettingsSchema>;
