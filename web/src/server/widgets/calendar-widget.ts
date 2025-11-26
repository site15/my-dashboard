/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { of } from 'rxjs';
import { z } from 'zod';

import { WidgetRender, WidgetRenderType } from '../types/WidgetSchema';

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

export type CalendarWidgetType = z.infer<typeof CalendarWidgetSchema>;

export const CALENDAR_FORMLY_FIELDS: FormlyFieldConfig[] = [
  {
    key: 'firstDayOfWeek',
    type: 'select',
    props: {
      label: 'First day of week',
      required: true,
      options: CalendarWidgetWeekdayKeys.map(key => ({
        value: key,
        label: CALENDAR_WIDGET_WEEKDAY_TITLE[key],
      })),
      placeholder: 'Select first day of week',
      attributes: { 'aria-label': 'Select first day of week' },
    },
  },
];

// Helper function to get monthly progress
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

export class CalendarWidgetRender implements WidgetRender<CalendarWidgetType> {
  render(widget: WidgetRenderType<CalendarWidgetType>) {
    const render = () => {
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

      return `
      <div class="bg-white p-6 rounded-2xl long-shadow transition-all duration-300 relative overflow-hidden h-40 flex flex-col justify-between border-l-4 border-pastel-blue">
        <div class="flex justify-between items-start">
          <div class="flex flex-col">
            <p class="text-sm text-gray-500 font-medium">Current Date</p>
            <p class="text-2xl font-extrabold text-gray-800">${dateElement}</p>
          </div>
          <button class="text-pastel-blue hover:text-pastel-blue/80 p-2 rounded-full transition-colors bg-pastel-blue/10 dark:bg-pastel-blue/30">
            <i data-lucide="calendar" class="w-6 h-6"></i>
          </button>
        </div>

        <div class="mt-4">
          <p class="text-sm text-gray-600 mb-1 font-medium">${progressText}</p>
          <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
            <div class="h-2.5 rounded-full bg-pastel-blue transition-all duration-500" style="width: ${progress}%"></div>
          </div>
        </div>
      </div>
    `;
    };

    return of(render());
  }
}
