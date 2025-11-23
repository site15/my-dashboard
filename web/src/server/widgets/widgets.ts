/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { z } from 'zod';

import {
  CALENDAR_FORMLY_FIELDS,
  CalendarWidgetSchema,
} from './calendar-widget';
import { CLOCK_FORMLY_FIELDS, ClockWidgetSchema } from './clock-widget';

export const WIDGETS_FORMLY_FIELDS: Record<string, FormlyFieldConfig[]> = {
  clock: CLOCK_FORMLY_FIELDS,
  calendar: CALENDAR_FORMLY_FIELDS,
};

export const WIDGETS_ZOD_SCHEMAS = {
  clock: ClockWidgetSchema,
  calendar: CalendarWidgetSchema,
};

export const WidgetsSchema = z.discriminatedUnion('type', [
  ClockWidgetSchema,
  CalendarWidgetSchema,
]);

export type WidgetsType = z.infer<typeof WidgetsSchema>;
