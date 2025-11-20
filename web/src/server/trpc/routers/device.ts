import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { prisma } from '../../prisma';
import { LinkDeviceSchema } from '../../types/DashboardSchema';
import { publicProcedure, router } from '../trpc';

export const deviceRouter = router({
  link: publicProcedure
    .input(LinkDeviceSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User not found!',
        });
      }
      await prisma.dashboard.update({
        where: {
          id: input.dashboardId,
          userId: ctx.user.id,
          qrCodes: {
            every: { code: input.code, dashboardId: input.dashboardId },
          },
        },
        data: { deviceId: input.deviceId, updatedAt: new Date() },
      });
    }),
});