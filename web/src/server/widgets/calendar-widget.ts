import { FormlyFieldConfig } from '@ngx-formly/core';
import { of } from 'rxjs';
import { z } from 'zod';

import { WidgetRenderFunction } from '../types/WidgetSchema';

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
//

export const calendarWidgetRender: WidgetRenderFunction<CalendarWidgetType> = (
  widget: CalendarWidgetType
) => {
  const render = () => {
    const firstDayOfWeek =
      CALENDAR_WIDGET_WEEKDAY_INDEXES[widget.firstDayOfWeek] || 0;

    // Текущая дата для определения месяца и выделения дня
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDayOfMonth = now.getDate();

    // Создаем дату для первого дня текущего месяца
    const firstOfMonth = new Date(currentYear, currentMonth, 1);
    // Количество дней в текущем месяце
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Определяем, какой день недели является первым днем месяца (0-6)
    const startDayIndex = firstOfMonth.getDay(); // 0 (Вс) - 6 (Сб)

    // Смещаем индекс, чтобы он соответствовал `firstDayOfWeek`
    // Например, если firstDayOfWeek=1 (Пн), а startDayIndex=0 (Вс), то нужно 6 пустых ячеек.
    const paddingDays = (startDayIndex - firstDayOfWeek + 7) % 7;

    const weekdaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Перестраиваем массив дней недели, начиная с `firstDayOfWeek`
    const orderedWeekdays = [];
    for (let i = 0; i < 7; i++) {
      orderedWeekdays.push(weekdaysEn[(firstDayOfWeek + i) % 7]);
    }

    // Название месяца и года
    const monthName = firstOfMonth.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    // HTML-структура календаря
    return `
            <div class="max-w-lg mx-auto" data-theme="none">
                <div class="bg-white p-6 rounded-xl shadow-xl transition duration-300 hover:shadow-2xl">
                    <h2 class="text-3xl font-extrabold text-primary mb-6 text-center capitalize">${monthName}</h2>
                    
                    <!-- Заголовки дней недели -->
                    <div class="grid grid-cols-7 gap-2 text-sm font-semibold text-gray-500 uppercase">
                        ${orderedWeekdays
                          .map(day => `<div class="text-center">${day}</div>`)
                          .join('')}
                    </div>

                    <!-- Сетка дней месяца -->
                    <div class="grid grid-cols-7 gap-2 mt-2">
                        <!-- Пустые ячейки (Padding) -->
                        ${Array.from({ length: paddingDays })
                          .map(() => `<div class="h-10"></div>`)
                          .join('')}

                        <!-- Ячейки с днями -->
                        ${Array.from({ length: daysInMonth })
                          .map((_, index) => {
                            const day = index + 1;
                            let classes =
                              'h-10 flex items-center justify-center rounded-lg cursor-pointer transition duration-150';

                            // Стиль для сегодняшнего дня
                            if (
                              day === currentDayOfMonth &&
                              currentMonth === now.getMonth() &&
                              currentYear === now.getFullYear()
                            ) {
                              classes +=
                                ' bg-sky-500 text-white font-bold shadow-md transform scale-105 hover:bg-orange-600';
                            } else {
                              classes += ' text-gray-700 hover:bg-gray-100';
                            }

                            return `<div class="${classes}"><span class="text-sm">${day}</span></div>`;
                          })
                          .join('')}
                    </div>
                </div>
                </div>
            `;
  };

  return of(render());
};
