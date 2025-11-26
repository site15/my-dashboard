import { FormlyFieldConfig } from '@ngx-formly/core';
import { of } from 'rxjs';
import { z } from 'zod';

import { WidgetRenderFunction } from '../types/WidgetSchema';

// Define the habit item structure

export const HabitsWidgetItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  minValue: z.number(),
  maxValue: z.number(),
  currentValue: z.number().default(0),
  history: z
    .array(
      z.object({
        id: z.number(),
        time: z.string(),
      })
    )
    .nullish()
    .optional(),
});

export type HabitsWidgetItemType = z.infer<typeof HabitsWidgetItemSchema>;

export const HabitsWidgetSchema = z.object({
  type: z.literal('habits'),
  name: z.string(),
  items: z.array(HabitsWidgetItemSchema).default([]),
});

export type HabitsWidgetType = z.infer<typeof HabitsWidgetSchema>;

// Formly field configuration for the habits widget
export const HABITS_FORMLY_FIELDS: FormlyFieldConfig[] = [
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
    key: 'items',
    type: 'repeat',
    props: {
      addText: 'Add habit',
      label: 'Habits',
    },
    fieldArray: {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          key: 'id',
          type: 'input',
          props: {
            label: 'ID',
            required: true,
            placeholder: 'Unique identifier',
            attributes: { 'aria-label': 'Enter habit ID' },
          },
        },
        {
          key: 'name',
          type: 'input',
          props: {
            label: 'Name',
            required: true,
            placeholder: 'Habit name',
            attributes: { 'aria-label': 'Enter habit name' },
          },
        },
        {
          key: 'icon',
          type: 'input',
          props: {
            label: 'Icon',
            placeholder: 'Lucide icon name',
            attributes: { 'aria-label': 'Enter icon name' },
          },
        },
        {
          key: 'color',
          type: 'select',
          props: {
            label: 'Color',
            options: [
              { value: 'blue', label: 'Blue' },
              { value: 'orange', label: 'Orange' },
              { value: 'purple', label: 'Purple' },
              { value: 'green', label: 'Green' },
              { value: 'red', label: 'Red' },
              { value: 'yellow', label: 'Yellow' },
              { value: 'pink', label: 'Pink' },
            ],
            placeholder: 'Select color',
            attributes: { 'aria-label': 'Select color' },
          },
        },
        {
          key: 'minValue',
          type: 'input',
          props: {
            label: 'Min Value',
            type: 'number',
            placeholder: '0',
            attributes: { 'aria-label': 'Enter minimum value' },
          },
        },
        {
          key: 'maxValue',
          type: 'input',
          props: {
            label: 'Max Value',
            type: 'number',
            placeholder: '5',
            attributes: { 'aria-label': 'Enter maximum value' },
          },
        },
      ],
    },
  },
];

// Function to calculate progress percentage
function calculateProgressPercentage(item: HabitsWidgetItemType): number {
  if (item.maxValue === item.minValue) return 0;
  return (
    ((item.currentValue - item.minValue) / (item.maxValue - item.minValue)) *
    100
  );
}

// Function to determine progress bar color based on value
function getProgressBarColor(percentage: number): string {
  if (percentage <= 33) {
    return 'bg-red-500';
  } else if (percentage <= 66) {
    return 'bg-blue-500';
  } else {
    return 'bg-green-500';
  }
}

export const habitsWidgetRender: WidgetRenderFunction<HabitsWidgetType> = (
  widget: HabitsWidgetType
) => {
  const render = () => {
    // Default items if none provided
    const items =
      widget.items && widget.items.length > 0
        ? widget.items
        : [
            {
              id: 'water',
              name: 'Water',
              icon: 'droplet',
              color: 'blue',
              minValue: 0,
              maxValue: 8,
              currentValue: 0,
              history: [],
            },
            {
              id: 'food',
              name: 'Food',
              icon: 'utensils',
              color: 'orange',
              minValue: 0,
              maxValue: 5,
              currentValue: 0,
              history: [],
            },
            {
              id: 'medication',
              name: 'Medication',
              icon: 'pill',
              color: 'purple',
              minValue: 0,
              maxValue: 5,
              currentValue: 0,
              history: [],
            },
            {
              id: 'exercise',
              name: 'Exercise',
              icon: 'dumbbell',
              color: 'green',
              minValue: 0,
              maxValue: 3,
              currentValue: 0,
              history: [],
            },
          ];

    return `
      <div class="bg-white p-6 rounded-2xl long-shadow group transition-all duration-300 relative overflow-hidden h-40 flex flex-col justify-between border-l-4 border-pastel-green">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-pastel-blue opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/70 backdrop-blur-sm dark:bg-[#1e1e1e]/70">
          <i data-lucide="pencil" class="w-5 h-5"></i>
        </button>
        <div class="flex items-center">
          <i data-lucide="activity" class="w-8 h-8 text-pastel-green mr-3"></i>
          <p class="text-lg font-medium text-gray-600">Habits</p>
        </div>
        <div id="habits-widget-content">
          <!-- Dynamic content will be inserted here -->
          ${renderWidgetContent(items)}
        </div>
      </div>
    `;
  };

  // Helper function to render widget content
  function renderWidgetContent(items: HabitsWidgetItemType[]): string {
    if (items.length === 0) {
      return '<p class="text-gray-500 text-sm">No habits configured</p>';
    }

    // Create container for top 3 items with icons and progress
    let topItemsHtml = '';
    const topItems = items.slice(0, 3);

    if (topItems.length > 0) {
      topItemsHtml = `
        <div class="grid grid-cols-3 gap-2 mt-2">
          ${topItems
            .map(item => {
              const percentage = calculateProgressPercentage(item);
              const progressBarColor = getProgressBarColor(percentage);

              return `
              <div class="flex flex-col items-center">
                <div class="flex items-center justify-center w-8 h-8 mb-1">
                  <i data-lucide="${item.icon}" class="w-5 h-5 text-${item.color}-500"></i>
                  <span class="text-lg font-bold text-gray-800 ml-1" id="${item.id}-count">${item.currentValue}</span>
                </div>
                <p class="text-xs text-gray-500 text-center">${item.name}</p>
                <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div id="${item.id}-progress" class="h-1.5 rounded-full ${progressBarColor} transition-all duration-500" style="width: ${percentage}%"></div>
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      `;
    }

    // Create container for remaining items as simple text
    let remainingItemsHtml = '';
    const remainingItems = items.slice(3);

    if (remainingItems.length > 0) {
      remainingItemsHtml = `
        <div class="flex flex-wrap gap-3 mt-2 text-sm">
          ${remainingItems
            .map(
              item => `
            <div class="flex items-center">
              <span class="text-gray-600">${item.name}: </span>
              <span class="font-bold text-gray-800" id="${item.id}-count">${item.currentValue}</span>
            </div>
          `
            )
            .join('')}
        </div>
      `;
    }

    return topItemsHtml + (remainingItems.length > 0 ? remainingItemsHtml : '');
  }

  return of(render());
};
