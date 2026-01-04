import { z } from 'zod';

import { TelegramUserDataSchema } from './TelegramUserDataSchema';
import { SupabaseUserDataSchema } from './SupabaseUserDataSchema';
import { UserScalarFieldEnum } from '../generated/prisma/internal/prismaNamespace';

export const UserSchema = z.object({
  [UserScalarFieldEnum.id]: z.string().uuid(),
  [UserScalarFieldEnum.anonymousId]: z.string().optional().nullish(),
  [UserScalarFieldEnum.telegramUserId]: z.string().optional().nullish(),
  [UserScalarFieldEnum.telegramUserData]:
    TelegramUserDataSchema.optional().nullish(),
  [UserScalarFieldEnum.supabaseUserId]: z.string().optional().nullish(),
  [UserScalarFieldEnum.supabaseUserData]:
    SupabaseUserDataSchema.optional().nullish(),
  [UserScalarFieldEnum.isBlackTheme]: z.boolean().nullish(),
  [UserScalarFieldEnum.createdAt]: z.date(),
  [UserScalarFieldEnum.updatedAt]: z.date(),
});

export type UserType = z.infer<typeof UserSchema>;
