/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { delay, of, tap } from 'rxjs';
import { z } from 'zod';

import { getClockName, linkFunctionsToWindow } from './clock-widget.utils';
import { WINDOW } from '../../app/utils/window';
import {
  WidgetRender,
  WidgetRenderInitFunctionOptions,
  WidgetRenderRenderFunctionOptions,
  WidgetRenderType,
} from '../types/WidgetSchema';
import { Timezone, TIMEZONE_OFFSET_TO_IANA } from '../utils/timezones';

export const CLOCK_WIDGET_TIMEZONE_TITLE: Record<string, string> =
  Object.fromEntries(
    Object.entries(Timezone)
      .filter(([, value]) => !isNaN(+value))
      .map(([label, value]) => [String(value), label])
  );

export const ClockWidgetTimezoneKeys = Object.keys(CLOCK_WIDGET_TIMEZONE_TITLE);

export const ClockWidgetTimezoneSchema = z.object({
  timezone: z.enum(ClockWidgetTimezoneKeys as any),
  label: z.string(),
});

export enum HourFormat {
  '12h' = 'h11',
  '24h' = 'h23',
}

export const CLOCK_WIDGET_HOUR_FORMAT_TITLE: Record<string, string> =
  Object.fromEntries(
    Object.entries(HourFormat)
      .filter(([, value]) => value.startsWith('h'))
      .map(([label, value]) => [String(value), label])
  );

export const ClockWidgetHourFormatKeys = Object.keys(
  CLOCK_WIDGET_HOUR_FORMAT_TITLE
);

export const ClockWidgetSchema = z.object({
  type: z.literal('clock'),
  name: z.string(),
  hourFormat: z
    .enum(ClockWidgetHourFormatKeys as any)
    .default(HourFormat['24h']),
  timezones: z.array(ClockWidgetTimezoneSchema),
});

export type ClockWidgetTimezoneType = z.infer<typeof ClockWidgetTimezoneSchema>;

export type ClockWidgetType = z.infer<typeof ClockWidgetSchema>;

export const CLOCK_FORMLY_FIELDS: FormlyFieldConfig[] = [
  {
    key: 'name',
    type: 'input',
    props: {
      label: 'Widget name',
      required: true,
      placeholder: 'Widget name',
      attributes: { 'aria-label': 'Enter widget name' },
    },
  },
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

// Helper function to get digital time for a timezone
function getDigitalTime(timezoneOffset: string): string {
  try {
    const timezone = TIMEZONE_OFFSET_TO_IANA[timezoneOffset];
    if (!timezone) return '--:--';

    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timezone,
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (_error) {
    return '--:--';
  }
}

export class ClockWidgetRender implements WidgetRender<ClockWidgetType> {
  private inited = false;
  init(
    widget: WidgetRenderType<ClockWidgetType>,
    options?: WidgetRenderInitFunctionOptions
  ) {
    if (this.inited) {
      return;
    }
    this.inited = true;

    linkFunctionsToWindow();

    WINDOW?.initializeClockWidget?.(
      widget.id,
      widget.options.timezones.map((tz: ClockWidgetTimezoneType) => {
        return {
          name: tz.label,
          timezone: tz.timezone,
        };
      }),
      options?.static || false
    );
  }

  render(
    widget: WidgetRenderType<ClockWidgetType>,
    options?: WidgetRenderRenderFunctionOptions
  ) {
    if (!options) {
      options = {};
    }
    if (options.init === undefined) {
      options.init = true;
    }
    const render = () => {
      // Get current times for the timezones
      const mainTime = widget.options.timezones[0]
        ? getDigitalTime(widget.options.timezones[0].timezone)
        : '--:--';
      const smallTime1 = widget.options.timezones[1]
        ? getDigitalTime(widget.options.timezones[1].timezone)
        : '--:--';
      const smallTime2 = widget.options.timezones[2]
        ? getDigitalTime(widget.options.timezones[2].timezone)
        : '--:--';

      // Get current times for the timezones
      const mainTimeName = widget.options.timezones[0].label
        ? getClockName(widget.id, 'main')
        : '--:--';
      const smallTime1Name = widget.options.timezones[1]
        ? getClockName(widget.id, 'small1')
        : '--:--';
      const smallTime2Name = widget.options.timezones[2]
        ? getClockName(widget.id, 'small2')
        : '--:--';

      return `
<!-- Виджет 1: Мировое Время (АНАЛОГОВЫЕ И ЦИФРОВЫЕ ЧАСЫ) -->
<!-- Область для ротации и клика по аналоговому циферблату -->
<div class="bg-white p-6 rounded-2xl long-shadow transition-all duration-300 relative overflow-hidden h-48 flex flex-col justify-between border-l-4 border-pastel-green">
    
    <!-- Главные часы (Аналоговые + Цифровые + Имя). Клик по цифровому блоку - ротация. Клик по canvas - модалка -->
    <div class="flex items-center justify-center flex-grow">
        
        <!-- Canvas для аналоговых часов - ОТКРЫТИЕ МОДАЛКИ -->
        <canvas id="main-analog-clock-${mainTimeName}" class="w-24 h-24 mr-6 cursor-pointer" 
                onclick="event.stopPropagation(); showModal('${widget.id}', 'clocks-modal');"></canvas> 
        
        <!-- Цифровое время и Имя - СМЕНА ГЛАВНЫХ ЧАСОВ -->
        <div class="flex flex-col items-center cursor-pointer" onclick="rotateClocks('${widget.id}', event);">
            <!-- Цифровые часы (уменьшенный шрифт, без секунд) -->
            <p id="main-clock-time-${mainTimeName}" class="text-4xl font-extrabold transition-colors duration-300 tracking-tight text-gray-800 dark:text-gray-100">${mainTime}</p>
            <!-- Имя часов (под цифровым временем) -->
            <p id="main-clock-name-${mainTimeName}" class="text-md font-medium mt-1 text-center text-gray-600 dark:text-gray-300">${widget.options.timezones[0]?.label || ''}</p>
        </div>
    </div>
        
    <!-- Маленькие часы (Горизонтальный стек) -->
    <div class="flex justify-around items-center w-full pt-2 mt-4 border-t border-gray-100 dark:border-gray-700">
        <div class="text-center w-1/2">
            <p id="small-clock-time-${smallTime1Name}" class="text-xl font-bold text-gray-800 dark:text-gray-200">${smallTime1}</p>
            <p id="small-clock-name-${smallTime1Name}" class="text-xs text-gray-500">${widget.options.timezones[1]?.label || ''}</p>
        </div>
        <div class="text-center w-1/2">
            <p id="small-clock-time-${smallTime2Name}" class="text-xl font-bold text-gray-800 dark:text-gray-200">${smallTime2}</p>
            <p id="small-clock-name-${smallTime2Name}" class="text-xs text-gray-500">${widget.options.timezones[2]?.label || ''}</p>
        </div>
    </div>
</div>
<!-- END Виджет 1 -->
`;
    };

    // For client-side, we still need to update the clocks periodically
    return of(render()).pipe(
      tap(() => setTimeout(() => this.init(widget, options)))
    );
  }
}
