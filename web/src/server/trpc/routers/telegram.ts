import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

import { TRPCError } from '@trpc/server';
import { ENVIRONMENTS } from '../../env';
import { prisma } from '../../prisma';
import { TelegramSettingsSchema } from '../../types/TelegramSettingsSchema';
import { TelegramUserDataSchema } from '../../types/TelegramUserDataSchema';
import { UserSchema, UserType } from '../../types/UserSchema';
import { checkSignature } from '../../utils/check-signature';

export const telegramRouter = router({
  settings: publicProcedure.output(TelegramSettingsSchema).query(() => ({
    authBotName: ENVIRONMENTS.MY_DASHBOARD_TELEGRAM_AUTH_BOT_NAME,
    authBotId: ENVIRONMENTS.MY_DASHBOARD_TELEGRAM_AUTH_BOT_TOKEN?.split(':')[0],
  })),

  signIn: publicProcedure
    .input(TelegramUserDataSchema)
    .output(
      z.object({
        sessionId: z.string().uuid(),
        user: UserSchema,
      })
    )
    .mutation(async ({ input }) => {
      if (!checkSignature(input)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Signature is wrong!',
        });
      }
      const user = await prisma.user.upsert({
        create: {
          telegramUserId: input.id.toString(),
          telegramUserData: input,
          createdAt: new Date(),
        },
        update: {
          telegramUserId: input.id.toString(),
          telegramUserData: input,
          createdAt: new Date(),
        },
        where: { telegramUserId: input.id.toString() },
      });
      const session = await prisma.session.create({
        data: { userId: user.id },
      });
      return { sessionId: session.id, user: user as UserType };
    }),
});
