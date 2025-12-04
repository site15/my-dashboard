/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { of, tap } from 'rxjs';
import { z } from 'zod';

import { linkFunctionsToWindow } from './habits-widget.utils';
import {
  WidgetRender,
  WidgetRenderInitFunctionOptions,
  WidgetRenderType,
} from '../types/WidgetSchema';

// Define the habit item structure

export const HabitsWidgetItemSchema = z.object({
  id: z.string().optional().nullish(),
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

//

export const CreateHabitsWidgetItemSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  minValue: z.number(),
  maxValue: z.number(),
  currentValue: z.number().default(0),
});

export type CreateHabitsWidgetItemType = z.infer<
  typeof CreateHabitsWidgetItemSchema
>;

//

export const HabitsWidgetSchema = z.object({
  type: z.literal('habits'),
  name: z.string(),
  items: z.array(HabitsWidgetItemSchema).default([]),
});

export type HabitsWidgetType = z.infer<typeof HabitsWidgetSchema>;

//

export const CreateHabitsWidgetSchema = z.object({
  type: z.literal('habits'),
  name: z.string(),
  items: z.array(CreateHabitsWidgetItemSchema).default([]),
});

export type CreateHabitsWidgetType = z.infer<typeof CreateHabitsWidgetSchema>;

// Formly field configuration for the habits widget
export const HABITS_FORMLY_FIELDS: FormlyFieldConfig[] = [
  {
    key: 'name',
    type: 'input',
    className: 'block text-lg font-medium text-gray-700 mb-2',
    props: {
      label: 'Widget name',
      required: true,
      placeholder: 'Widget name',
      attributes: {
        'aria-label': 'Enter widget name',
        class: 'flat-input',
      },
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
      fieldGroupClassName: 'grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          key: 'name',
          type: 'input',
          className: 'block text-lg font-medium text-gray-700 mb-2',
          props: {
            label: 'Name',
            required: true,
            placeholder: 'Habit name',
            attributes: {
              'aria-label': 'Enter habit name',
              class: 'flat-input',
            },
          },
        },
        {
          key: 'icon',
          type: 'icon-select',
          className: 'block text-lg font-medium text-gray-700 mb-2',
          props: {
            label: 'Icon',
            options: [
              { value: 'droplet', label: 'Water' },
              { value: 'utensils', label: 'Food' },
              { value: 'pill', label: 'Medication' },
              { value: 'dumbbell', label: 'Exercise' },
              { value: 'coffee', label: 'Coffee' },
              { value: 'glass-water', label: 'Glass of Water' },
              { value: 'apple', label: 'Apple' },
              { value: 'weight', label: 'Weight' },
              { value: 'heart-pulse', label: 'Heart Rate' },
              { value: 'brain', label: 'Mindfulness' },
              { value: 'book', label: 'Reading' },
              { value: 'music', label: 'Music' },
              { value: 'tv', label: 'TV/Movies' },
              { value: 'gamepad', label: 'Gaming' },
              { value: 'bed', label: 'Sleep' },
              { value: 'sun', label: 'Sun' },
              { value: 'moon', label: 'Moon' },
              { value: 'star', label: 'Star' },
              { value: 'smile', label: 'Smile' },
              { value: 'activity', label: 'Activity' },
            ],
            placeholder: 'Select icon',
            attributes: {
              'aria-label': 'Select icon',
              class: 'flat-input',
            },
          },
        },
        {
          key: 'color',
          type: 'color-select',
          className: 'block text-lg font-medium text-gray-700 mb-2',
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
            attributes: {
              'aria-label': 'Select color',
              class: 'flat-input',
            },
          },
        },
        {
          key: 'minValue',
          type: 'input',
          className: 'block text-lg font-medium text-gray-700 mb-2',
          props: {
            label: 'Min Value',
            type: 'number',
            placeholder: '0',
            attributes: {
              'aria-label': 'Enter minimum value',
              class: 'flat-input',
            },
          },
        },
        {
          key: 'maxValue',
          type: 'input',
          className: 'block text-lg font-medium text-gray-700 mb-2',
          props: {
            label: 'Max Value',
            type: 'number',
            placeholder: '5',
            attributes: {
              'aria-label': 'Enter maximum value',
              class: 'flat-input',
            },
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

export class HabitsWidgetRender implements WidgetRender<HabitsWidgetType> {
  private inited = false;
  init(
    widget: WidgetRenderType<HabitsWidgetType>,
    options?: WidgetRenderInitFunctionOptions
  ) {
    if (this.inited) {
      return;
    }
    this.inited = true;

    linkFunctionsToWindow();
  }

  render(
    widget: WidgetRenderType<HabitsWidgetType>,
    options?: WidgetRenderInitFunctionOptions
  ) {
    const render = (): string => {
      // Default items if none provided
      const items =
        widget.options.items && widget.options.items.length > 0
          ? widget.options.items
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

      // Generate unique IDs for this widget instance
      const modalId = `habits-modal-${widget.id}`;

      return `
      <div class="bg-white p-6 rounded-2xl long-shadow group transition-all duration-300 relative overflow-hidden h-40 flex flex-col justify-between border-l-4 border-pastel-green" onclick="showHabitsModal('${modalId}')">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-pastel-blue opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/70 backdrop-blur-sm dark:bg-[#1e1e1e]/70">
          <i data-lucide="pencil" class="w-5 h-5"></i>
        </button>
        <div class="flex items-center">
          <i ngSkipHydration="activity" class="w-8 h-8 text-pastel-green mr-3"></i>
          <p class="text-lg font-medium text-gray-600">Habits</p>
        </div>
        <div id="habits-widget-content">
          <!-- Dynamic content will be inserted here -->
          ${renderWidgetContent(items)}
        </div>
      </div>
      
      <!-- Habits Modal -->
      <div id="${modalId}" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 hidden opacity-0">
        <div class="bg-white rounded-3xl long-shadow p-6 w-full max-w-2xl transform transition-all duration-300 dark:bg-[#1E1E1E]">
          <div class="flex justify-between items-center border-b border-gray-100 pb-4 mb-6 dark:border-gray-700">
            <h2 class="text-2xl font-bold text-gray-800 flex items-center">
              <i data-lucide="activity" class="w-6 h-6 mr-2 text-pastel-green"></i>
              Habits Tracking
            </h2>
            <button onclick="hideHabitsModal('${modalId}')" class="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <i data-lucide="x" class="w-6 h-6"></i>
            </button>
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8" id="${modalId}-tracking-items-container">
            <!-- Dynamic items will be inserted here by JavaScript -->
          </div>
          
          <div class="border-t border-gray-100 dark:border-gray-700 pt-4">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-3">History</h3>
            <div id="${modalId}-consumption-list" class="max-h-60 overflow-y-auto pr-2">
              <!-- Items will be added dynamically -->
              <p class="text-gray-500 text-center py-4" id="${modalId}-no-consumption-message">No records</p>
            </div>
          </div>
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
                  <span class="text-lg font-bold text-gray-800 ml-1" id="habit-${item.id}-count">${item.currentValue}</span>
                </div>
                <p class="text-xs text-gray-500 text-center">${item.name}</p>
                <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div id="habit-${item.id}-progress" class="h-1.5 rounded-full ${progressBarColor} transition-all duration-500" style="width: ${percentage}%"></div>
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
              <span class="font-bold text-gray-800" id="habit-${item.id}-count">${item.currentValue}</span>
            </div>
          `
            )
            .join('')}
        </div>
      `;
      }

      return (
        topItemsHtml + (remainingItems.length > 0 ? remainingItemsHtml : '')
      );
    }

    return of(render()).pipe(tap(() => this.init(widget, options)));
  }
}
