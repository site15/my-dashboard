import { Observable } from 'rxjs';
import { z } from 'zod';

import { WidgetScalarFieldEnum } from '../generated/prisma/internal/prismaNamespace';
import {
  CreateWidgetsSchema,
  CreateWidgetsStateSchema,
  CreateWidgetsStateType,
  WidgetsSchema,
} from '../widgets/widgets';

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
  [WidgetScalarFieldEnum.state]: CreateWidgetsStateSchema,
});

export type UpdateWidgetStateType = z.infer<typeof UpdateWidgetStateSchema>;

export type WidgetRenderInitFunctionOptions = {
  static?: boolean;
  saveState?: (state: CreateWidgetsStateType, widget: WidgetType) => void;
};

export type WidgetRenderRenderFunctionOptions = {
  static?: boolean;
  init?: boolean;
  saveState?: (state: CreateWidgetsStateType, widget: WidgetType) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface WidgetRenderType<T, S = any> extends WidgetType {
  options?: T;
  state?: S;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface WidgetRender<T, S = any> {
  destroy?(widget: WidgetRenderType<T, S>): void;
  init?(
    widget: WidgetRenderType<T, S>,
    options?: WidgetRenderInitFunctionOptions
  ): void;
  render(
    widget: WidgetRenderType<T, S>,
    options?: WidgetRenderRenderFunctionOptions
  ): Observable<string>;
  beforeSave?(widget: Partial<WidgetRenderType<T, S>>): void;
}
