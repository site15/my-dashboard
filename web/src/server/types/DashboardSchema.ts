import { z } from 'zod';

import { DashboardScalarFieldEnum } from '../generated/prisma/internal/prismaNamespace';

export const DashboardSchema = z.object({
  [DashboardScalarFieldEnum.id]: z.string().uuid(),
  [DashboardScalarFieldEnum.name]: z.string(),
  [DashboardScalarFieldEnum.deviceId]: z.string().nullish(),
  [DashboardScalarFieldEnum.userId]: z.string().uuid(),
  [DashboardScalarFieldEnum.isBlackTheme]: z.boolean().nullish(),
  [DashboardScalarFieldEnum.createdAt]: z.date(),
  [DashboardScalarFieldEnum.updatedAt]: z.date(),
  [DashboardScalarFieldEnum.deletedAt]: z.date().nullish(),
});

export type DashboardType = z.infer<typeof DashboardSchema>;

//

export const CreateDashboardSchema = z.object({
  [DashboardScalarFieldEnum.name]: z.string(),
  [DashboardScalarFieldEnum.isBlackTheme]: z.boolean(),
});

export type CreateDashboardType = z.infer<typeof CreateDashboardSchema>;

//

export const UpdateDashboardSchema = z.object({
  [DashboardScalarFieldEnum.id]: z.string().uuid(),
  [DashboardScalarFieldEnum.name]: z.string(),
  [DashboardScalarFieldEnum.isBlackTheme]: z.boolean(),
});

export type UpdateDashboardType = z.infer<typeof UpdateDashboardSchema>;

//

export const GenerateQrCodeSchema = z.object({
  qr: z.string(),
  code: z.string(),
});

export type GenerateQrCodeType = z.infer<typeof GenerateQrCodeSchema>;

//

export const LinkDeviceSchema = z.object({
  dashboardId: z.string(),
  deviceId: z.string(),
  code: z.string(),
});

export type LinkDeviceType = z.infer<typeof LinkDeviceSchema>;
