import { z } from 'zod';

export const TelegramSettingsSchema = z.object({
  authBotName: z.string().nullish(),
  authBotId: z.string().nullish(),
});

export type TelegramSettingsType = z.infer<typeof TelegramSettingsSchema>;
