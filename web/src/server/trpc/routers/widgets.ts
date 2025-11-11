import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
// Import our prisma instance and the Prisma client

import { Prisma } from '../../generated/prisma/browser';
import { prisma } from '../../prisma';
import { UserSchema, UserType } from '../../types/UserSchema';
/*
export const widgetRouter = router({
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
*/