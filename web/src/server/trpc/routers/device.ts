import { TRPCError } from '@trpc/server';

import { prisma } from '../../prisma';
import {
  DeviceInfoSchema,
  DeviceLinkSchema,
} from '../../types/DashboardSchema';
import { publicProcedure, router } from '../trpc';

export const deviceRouter = router({
  link: publicProcedure.input(DeviceLinkSchema).mutation(async ({ input }) => {
    await prisma.dashboard.updateMany({
      where: {
        deviceId: { equals: input.deviceId },
      },
      data: { deviceId: null },
    });
    await prisma.dashboard.updateMany({
      where: {
        qrCodes: {
          every: { code: { equals: input.code }, deletedAt: { equals: null } },
        },
      },
      data: { deviceId: input.deviceId, updatedAt: new Date() },
    });
    await prisma.qrCode.updateMany({
      where: {
        code: { equals: input.code },
      },
      data: { deletedAt: new Date() },
    });
  }),

  info: publicProcedure.output(DeviceInfoSchema).query(async ({ ctx }) => {
    if (!ctx.deviceId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Device ID not found!',
      });
    }

    // Find the dashboard associated with this deviceId
    const dashboard = !ctx.deviceId
      ? null
      : await prisma.dashboard.findFirst({
          where: {
            deviceId: ctx.deviceId,
            deletedAt: null,
          },
          include: {
            Widget: true,
          },
        });

    if (!dashboard) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Dashboard not found for this device',
      });
    }

    // Return dashboard info and widgets
    return {
      id: dashboard.id,
      name: dashboard.name,
      isBlackTheme: dashboard.isBlackTheme,
      widgets: dashboard.Widget.map(widget => ({
        id: widget.id,
        options: widget.options,
        state: widget.state,
        columnIndex: widget.columnIndex,
        rowIndex: widget.rowIndex,
        columnCount: widget.columnCount,
        rowCount: widget.rowCount,
        isBlackTheme: widget.isBlackTheme,
        backgroundColor: widget.backgroundColor,
        primaryColor: widget.primaryColor,
        positiveColor: widget.positiveColor,
        negativeColor: widget.negativeColor,
      })),
    };
  }),
});
