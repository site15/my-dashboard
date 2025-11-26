/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { interval, map, of } from 'rxjs';
import { z } from 'zod';

import { WINDOW } from '../../app/utils/window';
import {
  WidgetRender,
  WidgetRenderFunctionOptions,
  WidgetRenderType,
} from '../types/WidgetSchema';
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

function loadScript(src: string, callback: () => void) {
  const script = document.createElement('script');
  script.src = src;
  script.type = 'module';
  script.async = true; // Scripts are async by default when dynamically added, but explicit is clear

  // Optional: Add onload and onerror handlers for better control and error handling
  script.onload = () => {
    console.log(`${src} loaded successfully.`);
    if (callback) {
      callback();
    }
  };
  script.onerror = () => {
    console.error(`Error loading script: ${src}`);
  };

  document.head.appendChild(script); // Append to the head or body
}

export class ClockWidgetRender implements WidgetRender<ClockWidgetType> {
  inited = false;
  init(widget: WidgetRenderType<ClockWidgetType>) {
    if (this.inited) {
      return;
    }
    this.inited = true;
    loadScript('./widgets/clock-widget.js', () => {
      WINDOW?.initializeClockWidget?.(
        widget.options.timezones.map((tz: ClockWidgetTimezoneType) => {
          return {
            name: tz.label,
            timezone: getDigitalTime(tz.timezone),
            color: '#8A89F0',
          };
        })
      );
      alert('afterRender');
    });
  }

  render(
    widget: WidgetRenderType<ClockWidgetType>,
    options?: WidgetRenderFunctionOptions
  ) {
    const render = () => {
      // For SSR or static rendering, return a simplified version with actual time
      if (isSSR || options?.static) {
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

        return `
        <div class="bg-white p-6 rounded-2xl long-shadow transition-all duration-300 relative overflow-hidden h-48 flex flex-col justify-between border-l-4 border-pastel-green">
          <div class="flex items-center justify-center flex-grow">
            <div class="w-24 h-24 mr-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="flex flex-col items-center">
              <p class="text-4xl font-extrabold text-gray-800">${mainTime}</p>
              <p class="text-md font-medium mt-1 text-center text-gray-600">${widget.options.timezones[0]?.label || 'Clock'}</p>
            </div>
          </div>
          <div class="flex justify-around items-center w-full pt-2 mt-4 border-t border-gray-100">
            <div class="text-center w-1/2">
              <p class="text-xl font-bold text-gray-800">${smallTime1}</p>
              <p class="text-xs text-gray-500">${widget.options.timezones[1]?.label || 'Timezone 1'}</p>
            </div>
            <div class="text-center w-1/2">
              <p class="text-xl font-bold text-gray-800">${smallTime2}</p>
              <p class="text-xs text-gray-500">${widget.options.timezones[2]?.label || 'Timezone 2'}</p>
            </div>
          </div>
        </div>
      `;
      }

      // For client-side rendering, return the widget container that will be populated by JavaScript
      // Generate unique IDs for the clocks based on the widget configuration
      const mainClockId = widget.options.timezones[0]?.label
        ? widget.options.timezones[0].label.replace(/\s+/g, '-')
        : 'main-clock';

      return `
      <div class="bg-white p-6 rounded-2xl long-shadow transition-all duration-300 relative overflow-hidden h-48 flex flex-col justify-between border-l-4 border-pastel-green">
        <div class="flex items-center justify-center flex-grow">
          <!-- Canvas for analog clock - will be populated by JavaScript -->
          <canvas id="main-analog-clock-${mainClockId}" class="w-24 h-24 mr-6 cursor-pointer" 
                  onclick="event.stopPropagation(); showModal('clocks-modal');"></canvas>
          <!-- Digital time and name - will be populated by JavaScript -->
          <div class="flex flex-col items-center cursor-pointer" onclick="rotateClocks(event);">
            <p id="main-clock-time-${mainClockId}" class="text-4xl font-extrabold transition-colors duration-300 tracking-tight text-gray-800">--:--</p>
            <p id="main-clock-name-${mainClockId}" class="text-md font-medium mt-1 text-center text-gray-600"></p>
          </div>
        </div>
        <div class="flex justify-around items-center w-full pt-2 mt-4 border-t border-gray-100">
          ${widget.options.timezones
            .slice(1, 3)
            .map((clock: ClockWidgetTimezoneType, index: number) => {
              const clockId = clock.label.replace(/\s+/g, '-');
              return `
            <div class="text-center w-1/2">
              <p id="small-clock-time-${index + 1}-${clockId}" class="text-xl font-bold text-gray-800">--:--</p>
              <p id="small-clock-name-${index + 1}-${clockId}" class="text-xs text-gray-500"></p>
            </div>
          `;
            })
            .join('')}
        </div>
      </div>
    `;
    };

    // For client-side, we still need to update the clocks periodically
    return !isSSR && !options?.static
      ? interval(1000).pipe(map(() => render()))
      : of(render());
  }
}
