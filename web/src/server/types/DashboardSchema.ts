import { z } from 'zod';

import {
  DashboardScalarFieldEnum,
  WidgetScalarFieldEnum,
} from '../generated/prisma/internal/prismaNamespace';

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

export const DeviceLinkSchema = z.object({
  deviceId: z.string(),
  code: z.string(),
});

export type DeviceLinkType = z.infer<typeof DeviceLinkSchema>;

//

// Device info response schema
export const DeviceInfoWidgetSchema = z.object({
  [WidgetScalarFieldEnum.id]: z.string().uuid(),
  [WidgetScalarFieldEnum.options]: z.any().nullish(),
  [WidgetScalarFieldEnum.state]: z.any().nullish(),
  [WidgetScalarFieldEnum.columnIndex]: z.number().nullish(),
  [WidgetScalarFieldEnum.rowIndex]: z.number().nullish(),
  [WidgetScalarFieldEnum.columnCount]: z.number().nullish(),
  [WidgetScalarFieldEnum.rowCount]: z.number().nullish(),
  [WidgetScalarFieldEnum.isBlackTheme]: z.boolean().nullish(),
  [WidgetScalarFieldEnum.backgroundColor]: z.string().nullish(),
  [WidgetScalarFieldEnum.primaryColor]: z.string().nullish(),
  [WidgetScalarFieldEnum.positiveColor]: z.string().nullish(),
  [WidgetScalarFieldEnum.negativeColor]: z.string().nullish(),
});

export type DeviceInfoWidgetType = z.infer<typeof DeviceInfoWidgetSchema>;

export const DeviceInfoSchema = z.object({
  [DashboardScalarFieldEnum.id]: z.string().uuid(),
  [DashboardScalarFieldEnum.name]: z.string(),
  [DashboardScalarFieldEnum.isBlackTheme]: z.boolean().nullish(),
  widgets: z.array(DeviceInfoWidgetSchema),
});

export type DeviceInfoType = z.infer<typeof DeviceInfoSchema>;
