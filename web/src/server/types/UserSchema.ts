import { z } from 'zod';

import { TelegramUserDataSchema } from './TelegramUserDataSchema';

export const UserSchema = z.object({
  id: z.string().uuid(),
  telegramUserId: z.string().optional().nullish(),
  telegramUserData: TelegramUserDataSchema.optional().nullish(),
  createdAt: z.date(),
});

export type UserType = z.infer<typeof UserSchema>;
