/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { of, tap } from 'rxjs';
import { z } from 'zod';

import { linkFunctionsToWindow } from './calendar-widget.utils';
import {
  WidgetRender,
  WidgetRenderInitFunctionOptions,
  WidgetRenderType,
} from '../types/WidgetSchema';

export enum CalendarWidgetWeekday {
  sunday = 'sunday',
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
  saturday = 'saturday',
}

export const CALENDAR_WIDGET_WEEKDAY_TITLE: Record<string, string> = {
  [CalendarWidgetWeekday.sunday]: 'Sunday',
  [CalendarWidgetWeekday.monday]: 'Monday',
  [CalendarWidgetWeekday.tuesday]: 'Tuesday',
  [CalendarWidgetWeekday.wednesday]: 'Wednesday',
  [CalendarWidgetWeekday.thursday]: 'Thursday',
  [CalendarWidgetWeekday.friday]: 'Friday',
  [CalendarWidgetWeekday.saturday]: 'Saturday',
};

export const CALENDAR_WIDGET_WEEKDAY_INDEXES: Record<string, number> = {
  [CalendarWidgetWeekday.sunday]: 0,
  [CalendarWidgetWeekday.monday]: 1,
  [CalendarWidgetWeekday.tuesday]: 2,
  [CalendarWidgetWeekday.wednesday]: 3,
  [CalendarWidgetWeekday.thursday]: 4,
  [CalendarWidgetWeekday.friday]: 5,
  [CalendarWidgetWeekday.saturday]: 6,
};

// Weekday abbreviations for display in calendar header
export const CALENDAR_WIDGET_WEEKDAY_ABBREVIATIONS: Record<string, string> = {
  [CalendarWidgetWeekday.sunday]: 'Su',
  [CalendarWidgetWeekday.monday]: 'Mo',
  [CalendarWidgetWeekday.tuesday]: 'Tu',
  [CalendarWidgetWeekday.wednesday]: 'We',
  [CalendarWidgetWeekday.thursday]: 'Th',
  [CalendarWidgetWeekday.friday]: 'Fr',
  [CalendarWidgetWeekday.saturday]: 'Sa',
};

export const CalendarWidgetWeekdayKeys = Object.keys(
  CALENDAR_WIDGET_WEEKDAY_TITLE
);

export const CalendarWidgetSchema = z.object({
  type: z.literal('calendar'),
  firstDayOfWeek: z
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .enum(CalendarWidgetWeekdayKeys as any)
    .default(CalendarWidgetWeekday.sunday),
});

export const CalendarWidgetStateSchema = z.object({
  type: z.literal('calendar'),
});

export type CalendarWidgetType = z.infer<typeof CalendarWidgetSchema>;

export const CALENDAR_FORMLY_FIELDS: FormlyFieldConfig[] = [
  {
    key: 'firstDayOfWeek',
    type: 'select',
    wrappers: ['flat-input-wrapper'],
    className: 'block text-lg font-medium text-gray-700 mb-2',
    props: {
      label: 'First day of week',
      // required: true,
      options: CalendarWidgetWeekdayKeys.map(key => ({
        value: key,
        label: CALENDAR_WIDGET_WEEKDAY_TITLE[key],
      })),
      placeholder: 'Select first day of week',
      attributes: {
        'aria-label': 'Select first day of week',
        class: 'flat-input',
      },
    },
  },
]; // Helper function to get monthly progress
function getMonthlyProgress() {
  const today = new Date();
  const currentDay = today.getDate();
  const lastDay = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  const progress = (currentDay / lastDay) * 100;
  return { currentDay, lastDay, progress: progress.toFixed(1) };
}

// Function to generate weekday headers based on firstDayOfWeek
function generateWeekdayHeaders(firstDayOfWeek: string): string {
  const weekdays = Object.keys(CALENDAR_WIDGET_WEEKDAY_TITLE);
  const abbreviations = CALENDAR_WIDGET_WEEKDAY_ABBREVIATIONS;

  // Find the starting index based on firstDayOfWeek
  const startIndex = CALENDAR_WIDGET_WEEKDAY_INDEXES[firstDayOfWeek];

  // Create an array of weekday abbreviations starting from firstDayOfWeek
  const orderedWeekdays = [];
  for (let i = 0; i < 7; i++) {
    const index = (startIndex + i) % 7;
    orderedWeekdays.push(weekdays[index]);
  }

  // Generate the HTML for weekday headers
  let html = '';
  orderedWeekdays.forEach((day, index) => {
    const isWeekend =
      day === CalendarWidgetWeekday.saturday ||
      day === CalendarWidgetWeekday.sunday;
    const textColorClass = isWeekend ? 'text-red-500' : '';
    html += `<div class="${textColorClass}">${abbreviations[day]}</div>`;
  });

  return html;
}

export class CalendarWidgetRender implements WidgetRender<CalendarWidgetType> {
  private inited: Record<string, boolean> = {};

  init(
    widget: WidgetRenderType<CalendarWidgetType>,
    options?: WidgetRenderInitFunctionOptions
  ) {
    linkFunctionsToWindow();

    if (this.inited[widget.id]) {
      return;
    }
    this.inited[widget.id] = true;
  }

  render(
    widget: WidgetRenderType<CalendarWidgetType>,
    options?: WidgetRenderInitFunctionOptions
  ) {
    const render = (): string => {
      // For the calendar widget, we want to show the monthly progress view
      // similar to the one in gemini-template.html
      const { progress } = getMonthlyProgress();
      const today = new Date();

      // Format date as "day month" (e.g., "25 November")
      const dateElement = today.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
      });

      // Format progress text
      const progressText = `${progress}% of month passed`;

      // Generate unique IDs for this widget instance
      const modalId = `calendar-modal-${widget.id}`;

      // Get the first day of week setting or default to sunday
      const firstDayOfWeek =
        widget.options?.firstDayOfWeek || CalendarWidgetWeekday.sunday;

      // Generate weekday headers based on firstDayOfWeek
      const weekdayHeaders = generateWeekdayHeaders(firstDayOfWeek);

      return `
      <div class="bg-white p-6 rounded-2xl long-shadow transition-all duration-300 relative overflow-hidden h-40 flex flex-col justify-between border-l-4 border-pastel-blue">
        <div class="flex justify-between items-start">
          <div class="flex flex-col">
            <p class="text-sm text-gray-500 font-medium">Current Date</p>
            <p class="text-2xl font-extrabold text-gray-800">${dateElement}</p>
          </div>
          <button class="text-pastel-blue hover:text-pastel-blue/80 p-2 rounded-full transition-colors" style="background-color: rgba(138, 137, 240, 0.1);" 
                  onclick="showCalendarModal('${modalId}', ${CALENDAR_WIDGET_WEEKDAY_INDEXES[firstDayOfWeek]})">
            <i data-lucide="calendar" class="w-6 h-6"></i>
          </button>
        </div>

        <div class="mt-4">
          <p class="text-sm text-gray-600 mb-1 font-medium">${progressText}</p>
          <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div class="h-2.5 rounded-full bg-[#8A89F0] transition-all duration-500" style="width: ${progress}%"></div>
          </div>
        </div>
      </div>
      
      <!-- Calendar Modal -->
      <div id="${modalId}" class="fixed inset-0 bg-opacity-10 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 hidden opacity-0">
        <div class="bg-white rounded-3xl long-shadow p-6 w-full max-w-md transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center border-b border-gray-100 pb-4 mb-4 sticky top-0 bg-white z-50">
            <h2 id="${modalId}-calendar-month-title" class="text-2xl font-bold text-gray-800"></h2>
            <button onclick="hideCalendarModal('${modalId}')" class="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100">
              <i data-lucide="x" class="w-6 h-6"></i>
            </button>
          </div>          
          <div class="grid grid-cols-7 gap-1 text-sm font-bold uppercase text-gray-500 mb-2 text-center">
            ${weekdayHeaders}
          </div>

          <div id="${modalId}-calendar-grid" class="grid grid-cols-7 gap-1">
            <!-- Days will be inserted here -->
          </div>
          
          <p class="text-center text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
            <span class="inline-block w-3 h-3 rounded-full bg-[#8A89F0] mr-1"></span> - Current day
            <span class="inline-block w-3 h-3 rounded-full ml-4" style="background-color: rgba(138, 137, 240, 0.2);"></span> - Past days
          </p>
        </div>
      </div>
    `;
    };

    return of(render()).pipe(tap(() => this.init(widget, options)));
  }
}
