/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { z } from 'zod';

import {
  CALENDAR_FORMLY_FIELDS,
  CalendarWidgetRender,
  CalendarWidgetSchema,
  CalendarWidgetStateSchema,
} from './calendar-widget';
import {
  CLOCK_FORMLY_FIELDS,
  ClockWidgetRender,
  ClockWidgetSchema,
  ClockWidgetStateSchema,
} from './clock-widget';
import {
  CURRENCY_FORMLY_FIELDS,
  CurrencyWidgetRender,
  CurrencyWidgetSchema,
  CurrencyWidgetStateSchema,
} from './currency-widget';
import {
  HABITS_FORMLY_FIELDS,
  HabitsWidgetSchema,
  HabitsWidgetRender,
  HabitsWidgetStateSchema,
} from './habits-widget';
import { WidgetRender } from '../types/WidgetSchema';

export const WIDGETS_FORMLY_FIELDS: Record<string, FormlyFieldConfig[]> = {
  clock: CLOCK_FORMLY_FIELDS,
  calendar: CALENDAR_FORMLY_FIELDS,
  habits: HABITS_FORMLY_FIELDS,
  currency: CURRENCY_FORMLY_FIELDS,
};

export const WIDGETS_ZOD_SCHEMAS = {
  clock: ClockWidgetSchema,
  calendar: CalendarWidgetSchema,
  habits: HabitsWidgetSchema,
  currency: CurrencyWidgetSchema,
};

export const WIDGETS_RENDERERS: Record<string, WidgetRender<any>> = {
  clock: new ClockWidgetRender(),
  calendar: new CalendarWidgetRender(),
  habits: new HabitsWidgetRender(),
  currency: new CurrencyWidgetRender(),
};

export const WidgetsSchema = z.discriminatedUnion('type', [
  ClockWidgetSchema,
  CalendarWidgetSchema,
  HabitsWidgetSchema,
  CurrencyWidgetSchema,
]);

export type WidgetsType = z.infer<typeof WidgetsSchema>;

//

export const CreateWidgetsSchema = z.discriminatedUnion('type', [
  ClockWidgetSchema,
  CalendarWidgetSchema,
  HabitsWidgetSchema,
  CurrencyWidgetSchema,
]);

export type CreateWidgetsType = z.infer<typeof CreateWidgetsSchema>;

export const CreateWidgetsStateSchema = z.discriminatedUnion('type', [
  ClockWidgetStateSchema,
  CalendarWidgetStateSchema,
  HabitsWidgetStateSchema,
  CurrencyWidgetStateSchema,
]);

export type CreateWidgetsStateType = z.infer<typeof CreateWidgetsStateSchema>;
