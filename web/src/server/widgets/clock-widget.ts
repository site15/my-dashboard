/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { interval, map, of } from 'rxjs';
import { z } from 'zod';

import { WidgetRenderFunction } from '../types/WidgetSchema';
import { isSSR } from '../utils/is-ssr';
import { Timezone, TIMEZONE_OFFSET_TO_IANA } from '../utils/timezones';

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
  '12h' = 'h11',
  '24h' = 'h23',
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

//

export const clockWidgetRender: WidgetRenderFunction<ClockWidgetType> = (
  widget: ClockWidgetType,
  options?: { static: boolean }
) => {
  const render = () => {
    const timezoneValues = widget.timezones.map((clock, index) => {
      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: index === 0 ? '2-digit' : undefined, // Только для главных часов показываем секунды
        hourCycle:
          HourFormat[widget.hourFormat as keyof typeof HourFormat] ||
          HourFormat['24h'], // Default to 24-hour format
        timeZone: TIMEZONE_OFFSET_TO_IANA[clock.timezone],
      };
      const dateOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: TIMEZONE_OFFSET_TO_IANA[clock.timezone],
      };

      const nowInZone = new Date();
      const timeString = nowInZone.toLocaleString('en-US', timeOptions as any);
      const dateString = nowInZone.toLocaleString('en-US', dateOptions as any);
      return {
        clock,
        time: timeString,
        date: index === 0 ? dateString : undefined,
      };
    });

    return `
                <div id="clocks-container" class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-1 lg:gap-4">
                <div id="main-clock" class="col-span-1 md:col-span-2 lg:col-span-2 p-6 rounded-xl shadow-xl bg-sky-500 text-white flex flex-col justify-center items-center transition duration-300 transform hover:scale-[1.01] hover:shadow-2xl">
                    <div id="time-0" class="text-5xl md:text-6xl lg:text-7xl font-black mb-1">${timezoneValues[0].time}</div>
                    <div class="text-lg md:text-2xl font-semibold opacity-90">${timezoneValues[0].clock.label}</div>
                    <div id="date-0" class="text-sm md:text-base opacity-75 mt-1">${timezoneValues[0].date}</div>
                </div>
                
                <div class="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-1 lg:gap-4">
                    ${timezoneValues
                      .slice(1)
                      .map(
                        (timezoneValue, index) => `
                        <div id="clock-${index + 1}" class="p-4 rounded-xl shadow-lg bg-white flex flex-col justify-center items-center transition duration-300 hover:bg-gray-50">
                            <div id="time-${index + 1}" class="text-3xl md:text-4xl font-extrabold text-gray-800">${timezoneValue.time}</div>
                            <div class="text-sm md:text-base font-medium text-gray-600 mt-1">${timezoneValue.clock.label}</div>
                        </div>
                    `
                      )
                      .join('')}
                </div>
                
                </div>
                
            `;
  };

  return !isSSR && !options?.static
    ? interval(1000).pipe(map(() => render()))
    : of(render());
};
