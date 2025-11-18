import { randomUUID } from 'crypto';

import { z } from 'zod';

import { prisma } from '../../prisma';
import { UserSchema, UserType } from '../../types/UserSchema';
import { publicProcedure, router } from '../trpc';

export const authRouter = router({
  profile: publicProcedure
    .output(UserSchema.nullish())
    .query(async ({ ctx }) => {
      return ctx.user as UserType;
    }),

  signInAsAnonymous: publicProcedure
    .input(
      z
        .object({
          anonymousId: z.string().nullish(),
        })
        .nullish()
    )
    .output(
      z.object({
        sessionId: z.string().uuid(),
        user: UserSchema,
      })
    )
    .mutation(async options => {
      const user = await prisma.user.create({
        data: {
          anonymousId: options?.input?.anonymousId || randomUUID(),
          createdAt: new Date(),
        },
      });
      const session = await prisma.session.create({
        data: { userId: user.id },
      });
      return { sessionId: session.id, user: user as UserType };
    }),

  signOut: publicProcedure.mutation(async ({ ctx }) => {
    if (ctx.session?.id) {
      await prisma.session.update({
        where: { id: ctx.session?.id },
        data: { deletedAt: new Date(0) },
      });
    }
  }),
});
