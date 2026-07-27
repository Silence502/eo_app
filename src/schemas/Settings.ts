import { z } from "zod";

export const SettingsSchema = z.object({
  timezone: z.string().optional(),
  notificationsEmail: z.boolean().optional().default(true),
  notificationsSms: z.boolean().optional().default(false),
});

export type UserSettings = z.infer<typeof SettingsSchema>;
