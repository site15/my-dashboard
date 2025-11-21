/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRPCError } from '@trpc/server';
import { isEqual } from 'es-toolkit';
import { z } from 'zod';

import { prisma } from '../../prisma';
import {
  CreateWidgetSchema,
  UpdateWidgetSchema,
  UpdateWidgetStateSchema,
  WidgetSchema,
  WidgetType,
} from '../../types/WidgetSchema';
import { publicProcedure, router } from '../trpc';

export const widgetsRouter = router({
  create: publicProcedure
    .input(CreateWidgetSchema)
    .output(WidgetSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User not found!',
        });
      }
      return (await prisma.widget.create({
        data: {
          type: input.type,
          options: input.options as any,
          columnIndex: input.columnIndex,
          rowIndex: input.rowIndex,
          columnCount: input.columnCount,
          rowCount: input.rowCount,
          isBlackTheme: input.isBlackTheme,
          backgroundColor: input.backgroundColor,
          primaryColor: input.primaryColor,
          positiveColor: input.positiveColor,
          negativeColor: input.negativeColor,
          dashboardId: input.dashboardId,
          createdAt: new Date(),
        },
      })) satisfies WidgetType;
    }),
  read: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .output(WidgetSchema)
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User not found!',
        });
      }
      return (await prisma.widget.findFirstOrThrow({
        where: {
          id: input.id,
        },
      })) satisfies WidgetType;
    }),
  update: publicProcedure
    .input(UpdateWidgetSchema)
    .output(WidgetSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User not found!',
        });
      }
      return prisma.$transaction(async trx => {
        const oldWidget = await trx.widget.findFirstOrThrow({
          select: { state: true, options: true },
          where: { id: input.id },
        });
        const newWidget = await trx.widget.update({
          data: {
            options: input.options as any,
            columnIndex: input.columnIndex,
            rowIndex: input.rowIndex,
            columnCount: input.columnCount,
            rowCount: input.rowCount,
            isBlackTheme: input.isBlackTheme,
            backgroundColor: input.backgroundColor,
            primaryColor: input.primaryColor,
            positiveColor: input.positiveColor,
            negativeColor: input.negativeColor,
            updatedAt: new Date(),
          },
          where: { id: input.id },
        });

        if (
          !isEqual(oldWidget.state, newWidget.state) ||
          !isEqual(oldWidget.options, newWidget.options)
        ) {
          await trx.widgetLog.create({
            data: {
              createdAt: new Date(),
              newOptions: newWidget.options as any,
              newState: newWidget.state as any,
              oldOptions: oldWidget.options as any,
              oldState: oldWidget.state as any,
              widgetId: input.id,
            },
          });
        }
        return newWidget satisfies WidgetType;
      });
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
      await prisma.widget.update({
        data: {
          deletedAt: new Date(),
        },
        where: {
          id: input.id,
        },
      });
    }),
  list: publicProcedure
    .input(z.object({ dashboardId: z.string().uuid() }))
    .query(async ({ input }) => {
      return (await prisma.widget.findMany({
        where: {
          dashboardId: { equals: input.dashboardId },
          deletedAt: { equals: null },
        },
      })) as WidgetType[];
    }),
  updateState: publicProcedure
    .input(UpdateWidgetStateSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User not found!',
        });
      }
      return prisma.$transaction(async trx => {
        const oldWidget = await trx.widget.findFirstOrThrow({
          select: { state: true, options: true },
          where: { id: input.id },
        });
        const newWidget = await trx.widget.update({
          select: { state: true, options: true },
          data: {
            options: input.state,
            updatedAt: new Date(),
          },
          where: { id: input.id },
        });
        if (
          !isEqual(oldWidget.state, newWidget.state) ||
          !isEqual(oldWidget.options, newWidget.options)
        ) {
          await trx.widgetLog.create({
            data: {
              createdAt: new Date(),
              newOptions: newWidget.options as any,
              newState: newWidget.state as any,
              oldOptions: oldWidget.options as any,
              oldState: oldWidget.state as any,
              widgetId: input.id,
            },
          });
        }
      });
    }),
});
