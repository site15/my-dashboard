/**
 * Client-side TypeScript for handling habits tracking widget
 * This replicates the functionality from gemini-template.html
 */
/* global document */

import { WINDOW } from '../../app/utils/window';
import {
  addClass,
  appendChild,
  clearChildren,
  createElement,
  getElementById,
  setAttribute,
  setStyle,
  setTextContent,
} from '../utils/dom-utils';

// Type definitions
interface HabitHistoryEntry {
  id: number;
  time: string;
}

interface HabitItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  minValue: number;
  maxValue: number;
  currentValue: number;
  history: HabitHistoryEntry[];
}

// Global variable for habit items
let habitItems: HabitItem[] = [
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

/**
 * Initializes the habits widget with provided items
 * @param items - Array of habit items
 * @param scope - Document or element scope for DOM operations
 */
function initializeHabitsWidget(
  items: HabitItem[],
  scope: Document | HTMLElement = document
): void {
  if (items && items.length > 0) {
    habitItems = items;
  }
  updateWidgetDisplay(scope);
  updateTrackingCounts(scope);
}

/**
 * Adds an item consumption
 * @param itemId - ID of the item to increment
 * @param scope - Document or element scope for DOM operations
 */
function addItem(
  itemId: string,
  scope: Document | HTMLElement = document
): void {
  const item = habitItems.find(i => i.id === itemId);
  if (!item) return;

  // Increment current value if not at max
  if (item.currentValue < item.maxValue) {
    item.currentValue++;

    // Add to history
    const now = new Date();
    item.history.push({
      id: Date.now(),
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    updateTrackingCounts(scope);
    renderConsumptionList(scope);
    updateProgressBar(itemId, scope);
  }
}

/**
 * Removes last item consumption
 * @param itemId - ID of the item to decrement
 * @param scope - Document or element scope for DOM operations
 */
function removeItem(
  itemId: string,
  scope: Document | HTMLElement = document
): void {
  const item = habitItems.find(i => i.id === itemId);
  if (!item || item.currentValue <= item.minValue) return;

  // Decrement current value
  item.currentValue--;

  // Remove from history
  if (item.history.length > 0) {
    item.history.pop();
  }

  updateTrackingCounts(scope);
  renderConsumptionList(scope);
  updateProgressBar(itemId, scope);
}

/**
 * Updates progress bar color based on value
 * @param itemId - ID of the item to update
 * @param scope - Document or element scope for DOM operations
 */
function updateProgressBar(
  itemId: string,
  scope: Document | HTMLElement = document
): void {
  const item = habitItems.find(i => i.id === itemId);
  if (!item) return;

  const progressBar = getElementById(scope, `${itemId}-progress`);
  if (!progressBar) return;

  // Calculate percentage
  const percentage =
    ((item.currentValue - item.minValue) / (item.maxValue - item.minValue)) *
    100;

  // Set width
  setStyle(progressBar, 'width', `${percentage}%`);

  // Set color based on value
  if (percentage <= 33) {
    // Red (minimum)
    progressBar.className =
      'h-2 rounded-full bg-red-500 transition-all duration-500';
  } else if (percentage <= 66) {
    // Blue (medium)
    progressBar.className =
      'h-2 rounded-full bg-blue-500 transition-all duration-500';
  } else {
    // Green (maximum)
    progressBar.className =
      'h-2 rounded-full bg-green-500 transition-all duration-500';
  }

  // Update the text display for current/max
  const textElement = getElementById(scope, `${itemId}-count-text`);
  if (textElement) {
    setTextContent(textElement, `${item.currentValue} / ${item.maxValue}`);
  }
}

/**
 * Updates counts display
 * @param scope - Document or element scope for DOM operations
 */
function updateTrackingCounts(scope: Document | HTMLElement = document): void {
  habitItems.forEach(item => {
    const countElement = getElementById(scope, `${item.id}-count`);
    if (countElement) {
      setTextContent(countElement, item.currentValue.toString());
    }

    // Update progress bar
    updateProgressBar(item.id, scope);
  });
}

/**
 * Updates widget display to show all items
 * @param scope - Document or element scope for DOM operations
 */
function updateWidgetDisplay(scope: Document | HTMLElement = document): void {
  const widgetContent = getElementById(scope, 'habits-widget-content');
  if (!widgetContent) return;

  // Clear existing content
  clearChildren(widgetContent);

  // Create container for top 3 items with icons and progress
  const topItemsContainer = createElement(document, 'div');
  topItemsContainer.className = 'grid grid-cols-3 gap-2 mt-2';

  // Create container for remaining items as simple text
  const remainingItemsContainer = createElement(document, 'div');
  remainingItemsContainer.className = 'flex flex-wrap gap-3 mt-2 text-sm';

  // Process items
  habitItems.forEach((item, index) => {
    if (index < 3) {
      // Top 3 items with icons and progress
      const itemElement = createElement(document, 'div');
      itemElement.className = 'flex flex-col items-center';

      // Icon and count container
      const iconCountContainer = createElement(document, 'div');
      iconCountContainer.className =
        'flex items-center justify-center w-8 h-8 mb-1';

      const icon = createElement(document, 'i');
      setAttribute(icon, 'data-lucide', item.icon);
      icon.className = `w-5 h-5 text-${item.color}-500`;

      const count = createElement(document, 'span');
      count.className = 'text-lg font-bold text-gray-800 ml-1';
      setAttribute(count, 'id', `${item.id}-count`);
      setTextContent(count, item.currentValue.toString());

      appendChild(iconCountContainer, icon);
      appendChild(iconCountContainer, count);

      const label = createElement(document, 'p');
      label.className = 'text-xs text-gray-500 text-center';
      setTextContent(label, item.name);

      const progressContainer = createElement(document, 'div');
      progressContainer.className =
        'w-full bg-gray-200 rounded-full h-1.5 mt-1';

      const progressBar = createElement(document, 'div');
      setAttribute(progressBar, 'id', `${item.id}-progress`);
      progressBar.className =
        'h-1.5 rounded-full bg-red-500 transition-all duration-500';
      setStyle(progressBar, 'width', '0%');

      appendChild(progressContainer, progressBar);

      appendChild(itemElement, iconCountContainer);
      appendChild(itemElement, label);
      appendChild(itemElement, progressContainer);

      appendChild(topItemsContainer, itemElement);
    } else {
      // Remaining items as simple text
      const itemElement = createElement(document, 'div');
      itemElement.className = 'flex items-center';

      const text = createElement(document, 'span');
      text.className = 'text-gray-600';
      setTextContent(text, `${item.name}: `);

      const value = createElement(document, 'span');
      value.className = 'font-bold text-gray-800';
      setAttribute(value, 'id', `${item.id}-count`);
      setTextContent(value, item.currentValue.toString());

      appendChild(itemElement, text);
      appendChild(itemElement, value);

      appendChild(remainingItemsContainer, itemElement);
    }
  });

  appendChild(widgetContent, topItemsContainer);
  if (habitItems.length > 3) {
    appendChild(widgetContent, remainingItemsContainer);
  }

  // Refresh Lucide icons
  // if (typeof lucide !== 'undefined' && lucide.createIcons) {
  //   lucide.createIcons();
  // }
}

/**
 * Renders modal items dynamically
 * @param scope - Document or element scope for DOM operations
 */
function renderModalItems(scope: Document | HTMLElement = document): void {
  const container = getElementById(scope, 'habits-items-container');
  if (!container) return;

  // Clear existing content
  clearChildren(container);

  // Set up grid
  container.className = 'grid gap-4 mb-8';

  // Determine grid columns based on number of items
  if (habitItems.length <= 2) {
    addClass(container, 'grid-cols-2');
  } else if (habitItems.length <= 4) {
    addClass(container, 'grid-cols-2');
    addClass(container, 'sm:grid-cols-4');
  } else {
    addClass(container, 'grid-cols-2');
    addClass(container, 'sm:grid-cols-3');
  }

  // Add each item to the modal
  habitItems.forEach(item => {
    const itemElement = createElement(document, 'div');
    itemElement.className = `bg-${item.color}-50 dark:bg-${item.color}-900/30 p-4 rounded-2xl flex flex-col items-center`;

    const icon = createElement(document, 'i');
    setAttribute(icon, 'data-lucide', item.icon);
    icon.className = `w-8 h-8 text-${item.color}-500 mb-3`;

    const name = createElement(document, 'h3');
    name.className = 'text-lg font-bold text-gray-800 dark:text-white mb-4';
    setTextContent(name, item.name);

    const buttonsContainer = createElement(document, 'div');
    buttonsContainer.className = 'flex gap-3';

    const minusButton = createElement(document, 'button');
    minusButton.onclick = () => removeItem(item.id, scope);
    minusButton.className =
      'w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center text-2xl font-bold hover:bg-red-600 transition-colors';
    setTextContent(minusButton, '-');

    const plusButton = createElement(document, 'button');
    plusButton.onclick = () => addItem(item.id, scope);
    plusButton.className = `w-12 h-12 rounded-full bg-${item.color}-500 text-white flex items-center justify-center text-2xl font-bold hover:bg-${item.color}-600 transition-colors`;
    setTextContent(plusButton, '+');

    appendChild(buttonsContainer, minusButton);
    appendChild(buttonsContainer, plusButton);

    const progressContainer = createElement(document, 'div');
    progressContainer.className = 'w-full bg-gray-200 rounded-full h-2 mt-3';

    const progressBar = createElement(document, 'div');
    setAttribute(progressBar, 'id', `${item.id}-progress`);
    progressBar.className =
      'h-2 rounded-full bg-red-500 transition-all duration-500';
    setStyle(progressBar, 'width', '0%');

    appendChild(progressContainer, progressBar);

    const countText = createElement(document, 'div');
    setAttribute(countText, 'id', `${item.id}-count-text`);
    countText.className = 'text-xs text-gray-500 mt-1';
    setTextContent(countText, `${item.currentValue} / ${item.maxValue}`);

    appendChild(itemElement, icon);
    appendChild(itemElement, name);
    appendChild(itemElement, buttonsContainer);
    appendChild(itemElement, progressContainer);
    appendChild(itemElement, countText);

    appendChild(container, itemElement);
  });

  // Refresh Lucide icons
  // if (typeof lucide !== 'undefined' && lucide.createIcons) {
  //   lucide.createIcons();
  // }
}

/**
 * Renders consumption list in modal
 * @param scope - Document or element scope for DOM operations
 */
function renderConsumptionList(scope: Document | HTMLElement = document): void {
  const listElement = getElementById(scope, 'consumption-list');
  if (!listElement) return;

  // Clear the list
  clearChildren(listElement);

  // Combine and sort all consumption by time
  const allConsumption: (HabitHistoryEntry & {
    type: string;
    typeName: string;
    color: string;
  })[] = [];
  habitItems.forEach(item => {
    item.history.forEach(entry => {
      allConsumption.push({
        ...entry,
        type: item.id,
        typeName: item.name,
        color: item.color,
      });
    });
  });

  allConsumption.sort((a, b) => b.id - a.id);

  // Show/hide no consumption message
  const noConsumptionMessage = getElementById(scope, 'no-consumption-message');
  if (noConsumptionMessage) {
    setStyle(
      noConsumptionMessage,
      'display',
      allConsumption.length > 0 ? 'none' : 'block'
    );
  }
  setStyle(
    listElement,
    'display',
    allConsumption.length > 0 ? 'block' : 'none'
  );

  // Create list items
  allConsumption.forEach(item => {
    const listItem = createElement(document, 'div');
    listItem.className =
      'flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 mb-2';

    const iconContainer = createElement(document, 'div');
    iconContainer.className = 'flex items-center';

    const icon = createElement(document, 'i');
    const itemIcon = habitItems.find(i => i.id === item.type)?.icon || 'circle';
    setAttribute(icon, 'data-lucide', itemIcon);
    icon.className = `w-5 h-5 mr-3 text-${item.color}-500`;

    const text = createElement(document, 'span');
    text.className = 'text-gray-700 dark:text-gray-300';
    setTextContent(text, `${item.typeName} at ${item.time}`);

    appendChild(iconContainer, icon);
    appendChild(iconContainer, text);

    appendChild(listItem, iconContainer);
    appendChild(listElement, listItem);
  });

  // Refresh Lucide icons
  // if (typeof lucide !== 'undefined' && lucide.createIcons) {
  //   lucide.createIcons();
  // }
}

/**
 * Initializes tracking items
 * @param scope - Document or element scope for DOM operations
 */
function initTrackingItems(scope: Document | HTMLElement = document): void {
  // Update widget display to show all items
  updateWidgetDisplay(scope);
  updateTrackingCounts(scope);
}

export const linkFunctionsToWindow = (): void => {
  // Export all utility functions
  if (WINDOW) {
    WINDOW.initializeHabitsWidget = initializeHabitsWidget;
    WINDOW.addItem = addItem;
    WINDOW.removeItem = removeItem;
    WINDOW.updateTrackingCounts = updateTrackingCounts;
    WINDOW.updateWidgetDisplay = updateWidgetDisplay;
    WINDOW.renderModalItems = renderModalItems;
    WINDOW.renderConsumptionList = renderConsumptionList;
    WINDOW.initTrackingItems = initTrackingItems;
  }
};
