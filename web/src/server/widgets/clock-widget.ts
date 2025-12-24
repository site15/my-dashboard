/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { of, tap } from 'rxjs';
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
  name: z.string().min(1, { message: 'Name cannot be empty' }),
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
  name: z.string().min(1, { message: 'Name cannot be empty' }),
  hourFormat: z
    .enum(ClockWidgetHourFormatKeys as any)
    .default(HourFormat['24h']),
  timezones: z.array(ClockWidgetTimezoneSchema).nullish().optional(),
});

export const ClockWidgetStateSchema = z.object({
  type: z.literal('clock'),
});

export type ClockWidgetTimezoneType = z.infer<typeof ClockWidgetTimezoneSchema>;

export type ClockWidgetType = z.infer<typeof ClockWidgetSchema>;

export const CLOCK_FORMLY_FIELDS: FormlyFieldConfig[] = [
  {
    key: 'name',
    type: 'input',
    wrappers: ['flat-input-wrapper'],
    className: 'block text-lg font-medium text-gray-700 mb-2',
    props: {
      label: 'Widget name',
      // required: true,
      placeholder: 'Widget name',
      attributes: {
        'aria-label': 'Enter widget name',
        class: 'flat-input',
      },
    },
  },
  {
    key: 'hourFormat',
    type: 'select',
    wrappers: ['flat-input-wrapper'],
    className: 'block text-lg font-medium text-gray-700 mb-2',
    props: {
      label: 'Hour format',
      // required: true,
      options: ClockWidgetHourFormatKeys.map(key => ({
        value: key,
        label: CLOCK_WIDGET_HOUR_FORMAT_TITLE[key],
      })),
      placeholder: 'Select hour format',
      attributes: {
        'aria-label': 'Select hour format',
        class: 'flat-input',
      },
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
          key: 'name',
          type: 'input',
          wrappers: ['flat-input-wrapper'],
          className: 'block text-lg font-medium text-gray-700 mb-2',
          props: {
            label: 'Clock name',
            // required: true,
            placeholder: 'Clock name',
            attributes: {
              'aria-label': 'Enter clock name',
              class: 'flat-input',
            },
          },
        },
        {
          key: 'timezone',
          type: 'select',
          wrappers: ['flat-input-wrapper'],
          className: 'block text-lg font-medium text-gray-700 mb-2',
          props: {
            label: 'Timezone',
            // required: true,
            options: ClockWidgetTimezoneKeys.map(key => ({
              value: key,
              label: CLOCK_WIDGET_TIMEZONE_TITLE[key],
            })),
            placeholder: 'Select timezone',
            attributes: {
              'aria-label': 'Select timezone',
              class: 'flat-input',
            },
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
  private inited: Record<string, boolean> = {};

  init(
    widget: WidgetRenderType<ClockWidgetType>,
    options?: WidgetRenderInitFunctionOptions
  ) {
    console.log('Initializing clock widget');
    linkFunctionsToWindow();

    if (this.inited[widget.id]) {
      console.log('Clock widget already initialized');
      return;
    }
    this.inited[widget.id] = true;

    WINDOW?.initializeClockWidget?.(
      widget.id,
      widget.options?.timezones?.map((tz: ClockWidgetTimezoneType) => {
        return {
          name: tz.name,
          timezone: tz.timezone,
        };
      }) || [],
      options?.static || false
    );

    console.log('Initialized clock widget');
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
      console.log('Rendering clock widget');
      // Get current times for the timezones
      const mainTime = widget.options?.timezones?.[0]
        ? getDigitalTime(widget.options.timezones[0].timezone)
        : '--:--';
      const smallTime1 = widget.options?.timezones?.[1]
        ? getDigitalTime(widget.options.timezones[1].timezone)
        : '--:--';
      const smallTime2 = widget.options?.timezones?.[2]
        ? getDigitalTime(widget.options.timezones[2].timezone)
        : '--:--';

      // Get current times for the timezones
      const mainTimeName = widget.options?.timezones?.[0]?.name
        ? getClockName(widget.id, 'main')
        : '--:--';
      const smallTime1Name = widget.options?.timezones?.[1]
        ? getClockName(widget.id, 'small1')
        : '--:--';
      const smallTime2Name = widget.options?.timezones?.[2]
        ? getClockName(widget.id, 'small2')
        : '--:--';

      const modalId = getClockName(widget.id, 'clocks-modal');

      console.log('Rendering clock widget with modal ID:', modalId);
      return `
<!--
    ========================================
    9. CLOCKS MODAL (DIGITAL CLOCKS)
    ========================================
-->
<div id="${modalId}" class="fixed inset-0 bg-opacity-10 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 hidden opacity-0">
    <div class="bg-white rounded-3xl long-shadow p-6 w-full max-w-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center border-b border-gray-100 pb-4 mb-6 sticky top-0 bg-white z-50">
            <h2 class="text-2xl font-bold text-gray-800 flex items-center">
                <i data-lucide="globe" class="w-6 h-6 mr-2 text-pastel-green"></i>
                All Timezones (<span id="${modalId}-modal-total-clocks">${widget.options?.timezones?.length}</span>)
            </h2>
            <button onclick="hideClockModal('${modalId}','${widget.id}')" class="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
        </div>
        
        <p class="text-sm text-gray-600 mb-6">Total of <span id="${modalId}-modal-total-clocks-text">${widget.options?.timezones?.length}</span> locations configured for tracking.</p>

        <!-- Grid for all clocks (populated dynamically) -->
        <div id="${modalId}-all-clocks-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            <!-- Digital and Analog Clocks will be inserted here by renderAllClocksModal() -->
        </div>
        
        <button onclick="rotateClocks('${modalId}', '${widget.id}')" class="mt-6 w-full text-lg font-bold py-3 px-6 rounded-xl text-white bg-pastel-blue transition-all duration-300 flat-btn-shadow 
            bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide">
            Change Main Clocks (Now: ----)
        </button>
    </div>
</div>
<!-- Widget 1: World Time (ANALOG AND DIGITAL CLOCKS) -->
<!-- Area for rotation and clicking on analog clock face -->
<div class="bg-white p-6 rounded-2xl long-shadow transition-all duration-300 relative overflow-hidden h-48 flex flex-col justify-between border-l-4 border-pastel-green">
    
    <!-- Main clocks (Analog + Digital + Name). Click on digital block - rotation. Click on canvas - modal -->
    <div class="flex items-center justify-center flex-grow">
        
        <!-- Canvas for analog clocks - OPEN MODAL -->
        <canvas id="main-analog-clock-${mainTimeName}" class="w-24 h-24 mr-6 cursor-pointer" 
                onclick="event.stopPropagation(); showClockModal('${modalId}', '${widget.id}');"></canvas> 
        
        <!-- Digital time and Name - CHANGE MAIN CLOCKS -->
        <div class="flex flex-col items-center cursor-pointer" onclick="rotateClocks('${modalId}', '${widget.id}', event);">
            <!-- Digital time (reduced font, no seconds) -->
            <p id="main-clock-time-${mainTimeName}" class="text-4xl font-extrabold transition-colors duration-300 tracking-tight text-gray-800">${mainTime}</p>
            <!-- Clock name (under digital time) -->
            <p id="main-clock-name-${mainTimeName}" class="text-md font-medium mt-1 text-center text-gray-600">${widget.options?.timezones?.[0]?.name || ''}</p>
        </div>
    </div>
    ${
      smallTime1 !== '--:--' && smallTime2 !== '--:--'
        ? `
    <!-- Small clocks (Horizontal stack) -->
    <div class="flex justify-around items-center w-full pt-2 mt-4 border-t border-gray-100">
        <div class="text-center w-1/2">
            <p id="small-clock-time-${smallTime1Name}" class="text-xl font-bold text-gray-800">${smallTime1}</p>
            <p id="small-clock-name-${smallTime1Name}" class="text-xs text-gray-500">${widget.options?.timezones?.[1]?.name || ''}</p>
        </div>
        <div class="text-center w-1/2">
            <p id="small-clock-time-${smallTime2Name}" class="text-xl font-bold text-gray-800">${smallTime2}</p>
            <p id="small-clock-name-${smallTime2Name}" class="text-xs text-gray-500">${widget.options?.timezones?.[2]?.name || ''}</p>
        </div>
    </div>`
        : ''
    }
</div>
<!-- END Widget 1 -->
`;
    };

    // For client-side, we still need to update the clocks periodically
    return of(render()).pipe(
      tap(() => setTimeout(() => this.init(widget, options)))
    );
  }
}
