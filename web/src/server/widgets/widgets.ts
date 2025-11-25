/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { z } from 'zod';

import {
  CALENDAR_FORMLY_FIELDS,
  calendarWidgetRender,
  CalendarWidgetSchema,
} from './calendar-widget';
import {
  CLOCK_FORMLY_FIELDS,
  clockWidgetRender,
  ClockWidgetSchema,
} from './clock-widget';
import {
  HABITS_FORMLY_FIELDS,
  habitsWidgetRender,
  HabitsWidgetSchema,
} from './habits-widget';
import { WidgetRenderFunction } from '../types/WidgetSchema';

export const WIDGETS_FORMLY_FIELDS: Record<string, FormlyFieldConfig[]> = {
  clock: CLOCK_FORMLY_FIELDS,
  calendar: CALENDAR_FORMLY_FIELDS,
  habits: HABITS_FORMLY_FIELDS,
};

export const WIDGETS_ZOD_SCHEMAS = {
  clock: ClockWidgetSchema,
  calendar: CalendarWidgetSchema,
  habits: HabitsWidgetSchema,
};

export const WIDGETS_RENDERERS: Record<string, WidgetRenderFunction<any>> = {
  clock: clockWidgetRender,
  calendar: calendarWidgetRender,
  habits: habitsWidgetRender,
};

export const WidgetsSchema = z.discriminatedUnion('type', [
  ClockWidgetSchema,
  CalendarWidgetSchema,
  HabitsWidgetSchema,
]);

export type WidgetsType = z.infer<typeof WidgetsSchema>;