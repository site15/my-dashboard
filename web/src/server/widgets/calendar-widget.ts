import { FormlyFieldConfig } from '@ngx-formly/core';
import { z } from 'zod';

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
