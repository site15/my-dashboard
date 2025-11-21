import { TRPCError } from '@trpc/server';

import { prisma } from '../../prisma';
import {
  DeviceInfoSchema,
  DeviceLinkSchema,
} from '../../types/DashboardSchema';
import { publicProcedure, router } from '../trpc';

export const deviceRouter = router({
  link: publicProcedure
    .input(DeviceLinkSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // First, clear the deviceId from any existing dashboard
        await prisma.dashboard.updateMany({
          where: {
            deviceId: { equals: input.deviceId },
          },
          data: { deviceId: null },
        });

        // Find the QR code to get the dashboard ID
        const qrCode = await prisma.qrCode.findFirst({
          where: {
            code: input.code,
            deletedAt: null,
          },
          include: {
            Dashboard: true,
          },
        });

        if (!qrCode) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'QR code not found or already used',
          });
        }

        // Check if another dashboard already has this deviceId
        const existingDashboard = await prisma.dashboard.findUnique({
          where: {
            deviceId: input.deviceId,
          },
        });

        if (existingDashboard && existingDashboard.id !== qrCode.dashboardId) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Device ID is already linked to another dashboard',
          });
        }

        // Update the dashboard with the deviceId
        await prisma.dashboard.update({
          where: {
            id: qrCode.dashboardId,
          },
          data: {
            deviceId: input.deviceId,
            updatedAt: new Date(),
          },
        });

        // Mark the QR code as used
        await prisma.qrCode.update({
          where: {
            id: qrCode.id,
          },
          data: { deletedAt: new Date() },
        });
        ctx.logger.info('Device linked successfully', {
          deviceId: input.deviceId,
          dashboardId: qrCode.dashboardId,
        });
      } catch (error) {
        // Re-throw as TRPCError if it isn't already
        if (error instanceof TRPCError) {
          throw error;
        }

        // Handle Prisma errors specifically
        if (error instanceof Error && error.message.includes('P2002')) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Device ID is already linked to another dashboard',
            cause: error,
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to link device',
          cause: error instanceof Error ? error : new Error(String(error)),
        });
      }
    }),

  info: publicProcedure.output(DeviceInfoSchema).query(async ({ ctx }) => {
    // Extract deviceId from context (it's added in createContext)
    const deviceId = (ctx as any).deviceId;

    if (!deviceId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Device ID not found!',
      });
    }

    // Find the dashboard associated with this deviceId
    const dashboard = await prisma.dashboard.findFirst({
      where: {
        deviceId: deviceId,
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
