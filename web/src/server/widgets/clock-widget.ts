import { FormlyFieldConfig } from '@ngx-formly/core';
import { z } from 'zod';

import { Timezone } from '../utils/timezones';

export const CLOCK_WIDGET_TIMEZONE_TITLE: Record<string, string> =
  Object.fromEntries(
    Object.entries(Timezone)
      .filter(([, value]) => !isNaN(+value))
      .map(([label, value]) => [String(value), label])
  );

export const ClockWidgetTimezoneKeys = Object.keys(CLOCK_WIDGET_TIMEZONE_TITLE);

export const ClockWidgetTimezoneSchema = z.object({
  timezone: z
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .enum(ClockWidgetTimezoneKeys as any),
  label: z.string(),
});

export enum HourFormat {
  '12h' = 12,
  '24h' = 24,
}

export const CLOCK_WIDGET_HOUR_FORMAT_TITLE: Record<string, string> =
  Object.fromEntries(
    Object.entries(HourFormat)
      .filter(([, value]) => !isNaN(+value))
      .map(([label, value]) => [String(value), label])
  );

export const ClockWidgetHourFormatKeys = Object.keys(
  CLOCK_WIDGET_HOUR_FORMAT_TITLE
);

export const ClockWidgetSchema = z.object({
  type: z.literal('clock'),
  hourFormat: z
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .enum(ClockWidgetHourFormatKeys as any)
    .default(HourFormat['24h']),
  timezones: z.array(ClockWidgetTimezoneSchema),
});

export type ClockWidgetTimezoneType = z.infer<typeof ClockWidgetTimezoneSchema>;

export type ClockWidgetType = z.infer<typeof ClockWidgetSchema>;

export const CLOCK_FORMLY_FIELDS: FormlyFieldConfig[] = [
  {
    key: 'hourFormat',
    type: 'select',
    props: {
      label: 'Hour format',
      required: true,
      options: ClockWidgetHourFormatKeys.map(key => ({
        value: key,
        label: CLOCK_WIDGET_HOUR_FORMAT_TITLE[key],
      })),
      placeholder: 'Select hour format',
      attributes: { 'aria-label': 'Select hour format' },
    },
  },
  {
    key: 'timezones',
    type: 'repeat',
    props: {
      addText: 'Add clock',
      label: 'Clocks',
    },
    fieldArray: {
      fieldGroupClassName: 'grid',
      fieldGroup: [
        {
          key: 'label',
          type: 'input',
          props: {
            label: 'Clock name',
            required: true,
            placeholder: 'Clock name',
            attributes: { 'aria-label': 'Enter clock name' },
          },
        },
        {
          key: 'timezone',
          type: 'select',
          props: {
            label: 'Timezone',
            required: true,
            options: ClockWidgetTimezoneKeys.map(key => ({
              value: key,
              label: CLOCK_WIDGET_TIMEZONE_TITLE[key],
            })),
            placeholder: 'Select timezone',
            attributes: { 'aria-label': 'Select timezone' },
          },
        },
      ],
    },
  },
];
