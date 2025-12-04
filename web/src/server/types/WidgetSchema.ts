import { Observable } from 'rxjs';
import { z } from 'zod';

import { WidgetScalarFieldEnum } from '../generated/prisma/internal/prismaNamespace';
import { CreateWidgetsSchema, WidgetsSchema } from '../widgets/widgets';

export const WidgetSchema = z.object({
  [WidgetScalarFieldEnum.id]: z.string().uuid(),
  [WidgetScalarFieldEnum.type]: z.string(),
  [WidgetScalarFieldEnum.options]: z.any({}).nullish(),
  [WidgetScalarFieldEnum.state]: z.any().nullish(),
  [WidgetScalarFieldEnum.columnIndex]: z.number().nullish(),
  [WidgetScalarFieldEnum.rowIndex]: z.number().nullish(),
  [WidgetScalarFieldEnum.columnCount]: z.number().nullish(),
  [WidgetScalarFieldEnum.rowCount]: z.number().nullish(),
  [WidgetScalarFieldEnum.isBlackTheme]: z.boolean().nullish(),
  [WidgetScalarFieldEnum.isActive]: z.boolean().nullish(),  
  [WidgetScalarFieldEnum.backgroundColor]: z.string().nullish(),
  [WidgetScalarFieldEnum.primaryColor]: z.string().nullish(),
  [WidgetScalarFieldEnum.positiveColor]: z.string().nullish(),
  [WidgetScalarFieldEnum.negativeColor]: z.string().nullish(),
  [WidgetScalarFieldEnum.dashboardId]: z.string(),
  [WidgetScalarFieldEnum.createdAt]: z.date(),
  [WidgetScalarFieldEnum.updatedAt]: z.date(),
  [WidgetScalarFieldEnum.deletedAt]: z.date().nullish(),
});

export type WidgetType = z.infer<typeof WidgetSchema>;

//

export const CreateWidgetSchema = z.object({
  [WidgetScalarFieldEnum.type]: z.string(),
  [WidgetScalarFieldEnum.options]: CreateWidgetsSchema,
  [WidgetScalarFieldEnum.state]: z.any({}).nullish(),
  [WidgetScalarFieldEnum.columnIndex]: z.number().nullish(),
  [WidgetScalarFieldEnum.rowIndex]: z.number().nullish(),
  [WidgetScalarFieldEnum.columnCount]: z.number().nullish(),
  [WidgetScalarFieldEnum.rowCount]: z.number().nullish(),
  [WidgetScalarFieldEnum.isBlackTheme]: z.boolean().nullish(),
  [WidgetScalarFieldEnum.isActive]: z.boolean().nullish(),
  [WidgetScalarFieldEnum.backgroundColor]: z.string().nullish(),
  [WidgetScalarFieldEnum.primaryColor]: z.string().nullish(),
  [WidgetScalarFieldEnum.positiveColor]: z.string().nullish(),
  [WidgetScalarFieldEnum.negativeColor]: z.string().nullish(),
  [WidgetScalarFieldEnum.dashboardId]: z.string(),
});

export type CreateWidgetType = z.infer<typeof CreateWidgetSchema>;

//

export const UpdateWidgetSchema = z.object({
  [WidgetScalarFieldEnum.id]: z.string().uuid(),
  [WidgetScalarFieldEnum.options]: WidgetsSchema,
  [WidgetScalarFieldEnum.state]: z.any().nullish(),
  [WidgetScalarFieldEnum.columnIndex]: z.number().nullish(),
  [WidgetScalarFieldEnum.rowIndex]: z.number().nullish(),
  [WidgetScalarFieldEnum.columnCount]: z.number().nullish(),
  [WidgetScalarFieldEnum.rowCount]: z.number().nullish(),
  [WidgetScalarFieldEnum.isBlackTheme]: z.boolean().nullish(),
  [WidgetScalarFieldEnum.isActive]: z.boolean().nullish(),
  [WidgetScalarFieldEnum.backgroundColor]: z.string().nullish(),
  [WidgetScalarFieldEnum.primaryColor]: z.string().nullish(),
  [WidgetScalarFieldEnum.positiveColor]: z.string().nullish(),
  [WidgetScalarFieldEnum.negativeColor]: z.string().nullish(),
});

export type UpdateWidgetType = z.infer<typeof UpdateWidgetSchema>;

//

export const UpdateWidgetStateSchema = z.object({
  [WidgetScalarFieldEnum.id]: z.string().uuid(),
  [WidgetScalarFieldEnum.state]: z.any().nullish(),
});

export type UpdateWidgetStateType = z.infer<typeof UpdateWidgetStateSchema>;

export type WidgetRenderInitFunctionOptions = {
  static?: boolean;
};

export type WidgetRenderRenderFunctionOptions = {
  static?: boolean;
  init?: boolean;
};

export type WidgetRenderType<T> = WidgetType & { options?: T };

export interface WidgetRender<T> {
  init?(
    widget: WidgetRenderType<T>,
    options?: WidgetRenderInitFunctionOptions
  ): void;
  render(
    widget: WidgetRenderType<T>,
    options?: WidgetRenderRenderFunctionOptions
  ): Observable<string>;
}