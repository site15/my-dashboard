import { z } from 'zod';

export const TelegramUserDataSchema = z.object({
  id: z.number().positive(),
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  photo_url: z.string(),
  auth_date: z.number().positive(),
  hash: z.string().optional(),
});

export type TelegramUserDataType = z.infer<typeof TelegramUserDataSchema>;
