import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

import { TRPCError } from '@trpc/server';
import { UserSchema, UserType } from '../../types/UserSchema';
import { prisma } from '../../prisma';

export const authRouter = router({
  profile: publicProcedure
    .input(
      z.object({
        sessionId: z.string().uuid(),
      })
    )
    .output(UserSchema)
    .query(async ({ input }) => {
      const session = await prisma.session.findFirst({
        include: { User: true },
        where: { id: input.sessionId, deletedAt: null },
      });
      if (!session) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Session not found!',
        });
      }
      return session.User as UserType;
    }),

  signOut: publicProcedure
    .input(
      z.object({
        sessionId: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      const session = await prisma.session.findFirst({
        include: { User: true },
        where: { id: input.sessionId, deletedAt: null },
      });
      if (!session) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Session not found!',
        });
      }
      await prisma.session.update({
        where: { id: session.id },
        data: { deletedAt: new Date(0) },
      });
    }),
});
