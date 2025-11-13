import { z } from 'zod';

// Import our prisma instance and the Prisma client

import { Prisma } from '../../generated/prisma/browser';
import { prisma } from '../../prisma';
import { UserSchema, UserType } from '../../types/UserSchema';
import { publicProcedure, router } from '../trpc';
/**
 * Default selector for Note.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultUserSelect = {
  id: true,
  telegramUserId: true,
  telegramUserData: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export const userRouter = router({
  create: publicProcedure
    .input(
      z.object({
        externalId: z.string(),
      })
    )
    .output(UserSchema)
    .mutation(
      async ({ input }) =>
        (await prisma.user.create({
          data: {
            telegramUserId: input.externalId,
          },
          select: defaultUserSelect,
        })) as UserType
    ),
  remove: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.user.delete({
        where: {
          id: input.id,
        },
      });
    }),
  list: publicProcedure.query(async () => {
    return (await prisma.user.findMany({
      select: defaultUserSelect,
    })) as UserType[];
  }),
});
