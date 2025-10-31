import { z } from 'zod';
import { TelegramUserDataSchema } from './TelegramUserDataSchema';

export const UserSchema = z.object({
  id: z.string().uuid(),
  telegramUserId: z.string().optional().nullable(),
  telegramUserData: TelegramUserDataSchema.optional().nullable(),
  createdAt: z.date(),
});

export type UserType = z.infer<typeof UserSchema>;
