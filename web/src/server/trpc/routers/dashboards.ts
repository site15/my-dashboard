import { TRPCError } from '@trpc/server';
import QRCode from 'qrcode';
import { z } from 'zod';

import { prisma } from '../../prisma';
import {
  CreateDashboardSchema,
  DashboardSchema,
  DashboardType,
  GenerateQrCodeSchema,
  LinkDeviceSchema,
  UpdateDashboardSchema,
} from '../../types/DashboardSchema';
import { publicProcedure, router } from '../trpc';

export const dashboardsRouter = router({
  create: publicProcedure
    .input(CreateDashboardSchema)
    .output(DashboardSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User not found!',
        });
      }
      return (await prisma.dashboard.create({
        data: {
          name: input.name,
          userId: ctx.user.id,
          isBlackTheme: input.isBlackTheme,
          createdAt: new Date(),
        },
      })) satisfies DashboardType;
    }),
  read: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .output(DashboardSchema)
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User not found!',
        });
      }
      return (await prisma.dashboard.findFirstOrThrow({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      })) satisfies DashboardType;
    }),
  update: publicProcedure
    .input(UpdateDashboardSchema)
    .output(DashboardSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User not found!',
        });
      }
      return (await prisma.dashboard.update({
        data: {
          name: input.name,
          isBlackTheme: input.isBlackTheme,
          updatedAt: new Date(),
        },
        where: { id: input.id, userId: ctx.user.id },
      })) satisfies DashboardType;
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User not found!',
        });
      }
      await prisma.dashboard.update({
        data: {
          deletedAt: new Date(),
        },
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });
    }),
  list: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User not found!',
      });
    }
    return (await prisma.dashboard.findMany({
      where: { deletedAt: null, userId: ctx.user.id },
    })) as DashboardType[];
  }),
  linkDevice: publicProcedure
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
  generateQrCode: publicProcedure
    .input(
      z.object({
        dashboardId: z.string().uuid(),
      })
    )
    .output(GenerateQrCodeSchema)
    .query(async ({ input }) => {
      const qrCode = await prisma.qrCode.create({
        data: {
          dashboardId: input.dashboardId,
          code: Math.random().toString(36).substring(2, 15),
          createdAt: new Date(),
        },
      });
      return {
        qr: await QRCode.toDataURL(
          JSON.stringify({
            dashboardId: qrCode.dashboardId,
            code: qrCode.code,
          }),
          { width: 250 }
        ),
        code: qrCode.code,
      };
    }),
});
