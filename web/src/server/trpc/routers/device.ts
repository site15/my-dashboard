import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { prisma } from '../../prisma';
import { DashboardSchema } from '../../types/DashboardSchema';
import {
  DeviceInfoSchema,
  DeviceLinkSchema,
  SaveDeviceSettingsSchema,
} from '../../types/DeviceSchema';
import { publicProcedure, router } from '../trpc';

export const deviceRouter = router({
  log: publicProcedure.input(z.any()).mutation(async ({ input, ctx }) => {
    ctx.logger.log({
      event: 'Device log',
      ...(typeof input === 'string' ? { message: input } : { ...input }),
    });
  }),

  unlink: publicProcedure.mutation(async ({ ctx }) => {
    try {
      // First, clear the deviceId from any existing dashboard
      await prisma.dashboard.updateMany({
        where: {
          deviceId: { equals: ctx.deviceId },
          isActive: true,
        },
        data: { deviceId: null },
      });

      ctx.logger.log({
        event: 'Device unlinked successfully',
        payload: {
          deviceId: ctx.deviceId,
        },
      });
    } catch (error) {
      // Re-throw as TRPCError if it isn't already
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to unlink device',
        cause: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }),

  link: publicProcedure
    .input(DeviceLinkSchema)
    .output(DashboardSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // First, clear the deviceId from any existing dashboard
        await prisma.dashboard.updateMany({
          where: {
            deviceId: { equals: input.deviceId },
            isActive: true,
          },
          data: { deviceId: null },
        });

        // Find the QR code to get the dashboard ID
        const qrCode = await prisma.qrCode.findFirst({
          where: {
            code: input.code,
          },
          include: {
            Dashboard: true,
          },
        });

        if (!qrCode) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'QR code not found',
          });
        }

        if (qrCode.deletedAt) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'QR code already used',
          });
        }

        // Update the dashboard with the deviceId
        await prisma.dashboard.update({
          where: {
            id: qrCode.dashboardId,
            isActive: true,
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

        ctx.logger.log({
          event: 'Device linked successfully',
          payload: {
            deviceId: input.deviceId,
            dashboardId: qrCode.dashboardId,
          },
        });

        return await prisma.dashboard.findFirstOrThrow({
          where: {
            deviceId: input.deviceId,
            id: qrCode.dashboardId,
            isActive: true,
          },
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
    const deviceId = ctx.deviceId;

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
        isActive: true,
      },
      include: {
        Widget: { where: { deletedAt: null } },
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
        type: widget.type,
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

  saveSettings: publicProcedure
    .input(SaveDeviceSettingsSchema)
    .output(DashboardSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.deviceId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Device ID not found!',
        });
      }
      // Get the current dashboard to get the widgetsCount
      const currentDashboard = await prisma.dashboard.findFirst({
        where: { deviceId: ctx.deviceId, userId: ctx.user.id, isActive: true },
        include: {
          Widget: { where: { deletedAt: null } },
        },
      });

      if (!currentDashboard) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Dashboard not found!',
        });
      }

      // Update the dashboard
      const updatedDashboard = await prisma.dashboard.update({
        data: {
          isBlackTheme: input.isBlackTheme,
          updatedAt: new Date(),
        },
        where: { deviceId: ctx.deviceId, userId: ctx.user.id, isActive: true },
      });

      // Return the dashboard with widgetsCount
      return {
        ...updatedDashboard,
        widgetsCount: currentDashboard.Widget.length,
      };
    }),
});
