/* eslint-disable import/order */
/**
 * Client-side TypeScript for handling habits tracking widget
 * This replicates the functionality from gemini-template.html
 */
/* global document */

import { createIcons, icons } from 'lucide';

import { WINDOW } from '../../app/utils/window';
import { WidgetType } from '../types/WidgetSchema';
import {
  addClass,
  appendChild,
  clearChildren,
  createElement,
  getElementById,
  removeClass,
  setAttribute,
  setStyle,
  setTextContent,
} from '../utils/dom-utils';
import { isSSR } from '../utils/is-ssr';
import {
  HabitsWidgetItemType,
  HabitsWidgetStateHistoryType,
} from './habits-widget';
import { CreateWidgetsStateType } from './widgets';

// Type definitions
interface HabitHistoryEntry {
  id: string;
  time: string;
}

interface HabitItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  minValue: number;
  maxValue: number;
  history: HabitHistoryEntry[];
}

// Global variable for habit items
const habitItems: Record<string, HabitItem[]> = {};

let saveState:
  | undefined
  | ((state: CreateWidgetsStateType, widget: WidgetType) => void) = undefined;

export function setSaveState(
  fn: (state: CreateWidgetsStateType, widget: WidgetType) => void
): void {
  saveState = fn;
}

export function setHabitItems(
  widgetId: string,
  items: HabitsWidgetItemType[],
  history: HabitsWidgetStateHistoryType[]
): void {
  
  habitItems[widgetId] = (items?.length ? items : []).map(item => ({
    id: item.id || Math.random().toString(36).substring(2, 15),
    name: item.name || '',
    icon: item.icon || '',
    color: item.color || '',
    minValue: item.minValue || 0,
    maxValue: item.maxValue || 0,
    history: history
      .filter(h => h.itemId === item.id)
      .map(h => ({
        id: h.id,
        time: h.time,
      })),
  }));
}

export function getHabitItems(widgetId: string) {
  return habitItems[widgetId] || [];
}

/**
 * Adds an item consumption
 * @param itemId - ID of the item to increment
 * @param scope - Document or element scope for DOM operations
 */
function addItem(
  widgetId: string,
  itemId: string,
  scope: Document | HTMLElement = document
): void {
  const itemIndex = habitItems[widgetId].findIndex(i => i.id === itemId);
  if (itemIndex === -1) return;

  // Increment current value if not at max
  if (
    habitItems[widgetId][itemIndex].history.length <
    habitItems[widgetId][itemIndex].maxValue
  ) {
    if (!habitItems[widgetId][itemIndex].history) {
      habitItems[widgetId][itemIndex].history = [];
    }

    // Add to history
    const now = new Date();
    habitItems[widgetId][itemIndex].history.push({
      id: Math.random().toString(36).substring(2, 15),
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    updateTrackingCounts(widgetId, scope);
    renderConsumptionListForWidget();
    updateProgressBar(widgetId, itemId, scope);
  }
}

/**
 * Removes last item consumption
 * @param itemId - ID of the item to decrement
 * @param scope - Document or element scope for DOM operations
 */
function removeItem(
  widgetId: string,
  itemId: string,
  scope: Document | HTMLElement = document
): void {
  const itemIndex = habitItems[widgetId].findIndex(i => i.id === itemId);
  if (itemIndex === -1) return;

  // Remove from history
  if (habitItems[widgetId][itemIndex].history.length > 0) {
    habitItems[widgetId][itemIndex].history.pop();
  }

  updateTrackingCounts(widgetId, scope);
  renderConsumptionListForWidget();
  updateProgressBar(widgetId, itemId, scope);
}

/**
 * Updates progress bar color based on value
 * @param itemId - ID of the item to update
 * @param scope - Document or element scope for DOM operations
 */
function updateProgressBar(
  widgetId: string,
  itemId: string,
  scope: Document | HTMLElement = document
): void {
  
  const itemIndex = habitItems[widgetId].findIndex(i => i.id === itemId);
  if (itemIndex === -1) return;

  const progressBarIdClass = `habit-${itemId}-progress`;
  const progressBars = scope.querySelectorAll(
    `.${progressBarIdClass}`
  ) as NodeListOf<HTMLElement>;

  progressBars.forEach(progressBar => {
    if (!progressBar) return;

    // Calculate percentage
    const percentage =
      ((habitItems[widgetId][itemIndex].history.length -
        habitItems[widgetId][itemIndex].minValue) /
        (habitItems[widgetId][itemIndex].maxValue -
          habitItems[widgetId][itemIndex].minValue)) *
      100;

    // Set width
    setStyle(progressBar, 'width', `${percentage}%`);

    // Set color based on value
    if (percentage <= 33) {
      // Red (minimum)
      progressBar.className = `${progressBarIdClass} h-2 rounded-full bg-red-500 transition-all duration-500`;
    } else if (percentage <= 66) {
      // Blue (medium)
      progressBar.className = `${progressBarIdClass} h-2 rounded-full bg-blue-500 transition-all duration-500`;
    } else {
      // Green (maximum)
      progressBar.className = `${progressBarIdClass} h-2 rounded-full bg-green-500 transition-all duration-500`;
    }

  });

  // Update the text display for current/max
  const textElement = getElementById(scope, `habit-${itemId}-count-text`);
  if (textElement) {
    setTextContent(
      textElement,
      `${habitItems[widgetId][itemIndex].history.length} / ${habitItems[widgetId][itemIndex].maxValue}`
    );
  }
}

/**
 * Updates counts display
 * @param scope - Document or element scope for DOM operations
 */
function updateTrackingCounts(
  widgetId: string,
  scope: Document | HTMLElement = document
): void {
  habitItems[widgetId]?.forEach(item => {
    const countElement = getElementById(scope, `habit-${item.id}-count`);
    if (countElement) {
      setTextContent(countElement, item.history.length.toString());
    }

    // Update progress bar
    updateProgressBar(widgetId, item.id, scope);
  });
}

/**
 * Updates widget display to show all items
 * @param scope - Document or element scope for DOM operations
 */
function updateWidgetDisplay(
  widgetId: string,
  scope: Document | HTMLElement = document
): void {
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
  habitItems[widgetId]?.forEach((item, index) => {
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
      setAttribute(count, 'id', `habit-${item.id}-count`);
      setTextContent(count, item.history.length.toString());

      appendChild(iconCountContainer, icon);
      appendChild(iconCountContainer, count);

      const label = createElement(document, 'p');
      label.className = 'text-xs text-gray-500 text-center';
      setTextContent(label, item.name);

      const progressContainer = createElement(document, 'div');
      progressContainer.className =
        'w-full bg-gray-200 rounded-full h-1.5 mt-1';

      const progressBar = createElement(document, 'div');
      setAttribute(progressBar, 'id', `habit-${item.id}-progress`);
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
      setAttribute(value, 'id', `habit-${item.id}-count`);
      setTextContent(value, item.history.length.toString());

      appendChild(itemElement, text);
      appendChild(itemElement, value);

      appendChild(remainingItemsContainer, itemElement);
    }
  });

  appendChild(widgetContent, topItemsContainer);
  if (habitItems[widgetId].length > 3) {
    appendChild(widgetContent, remainingItemsContainer);
  }
  if (!isSSR) {
    createIcons({ icons });
  }
}

/**
 * Renders modal items dynamically
 * @param modalId - ID of the modal element
 * @param scope - Document or element scope for DOM operations
 */
function renderModalItems(
  widgetId: string,
  modalId: string,
  scope: Document | HTMLElement = document
): void {
  const container = getElementById(
    scope,
    `${modalId}-tracking-items-container`
  );
  if (!container) return;

  // Clear existing content
  clearChildren(container);

  // Set up grid
  container.className = 'grid gap-4 mb-8';

  // Determine grid columns based on number of items
  if (habitItems[widgetId].length <= 2) {
    addClass(container, 'grid-cols-2');
  } else if (habitItems[widgetId].length <= 4) {
    addClass(container, 'grid-cols-2');
    addClass(container, 'sm:grid-cols-4');
  } else {
    addClass(container, 'grid-cols-2');
    addClass(container, 'sm:grid-cols-3');
  }

  // Add each item to the modal
  habitItems[widgetId]?.forEach(item => {
    const itemElement = createElement(document, 'div');
    itemElement.className = `bg-${item.color}-50 p-4 rounded-2xl flex flex-col items-center`;

    const icon = createElement(document, 'i');
    setAttribute(icon, 'data-lucide', item.icon);
    icon.className = `w-8 h-8 text-${item.color}-500 mb-3`;

    const name = createElement(document, 'h3');
    name.className = 'text-lg font-bold text-gray-800 mb-4';
    setTextContent(name, item.name);

    const buttonsContainer = createElement(document, 'div');
    buttonsContainer.className = 'flex gap-3';

    const minusButton = createElement(document, 'button');
    minusButton.onclick = () => {
      removeItem(widgetId, item.id, scope);
      if (saveState) {
        saveState(
          {
            type: 'habits',
            history:
              habitItems[widgetId]
                ?.map(it =>
                  it.history?.map(h => ({
                    id: h.id,
                    itemId: it.id,
                    time: h.time,
                  }))
                )
                .flat() || [],
          },
          { id: widgetId } as WidgetType
        );
      }
    };
    minusButton.className =
      'w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center text-2xl font-bold hover:bg-red-600 transition-colors';
    setTextContent(minusButton, '-');

    const plusButton = createElement(document, 'button');
    plusButton.onclick = () => {
      addItem(widgetId, item.id, scope);
      if (saveState) {
        saveState(
          {
            type: 'habits',
            history:
              habitItems[widgetId]
                ?.map(it =>
                  it.history?.map(h => ({
                    id: h.id,
                    itemId: it.id,
                    time: h.time,
                  }))
                )
                .flat() || [],
          },
          { id: widgetId } as WidgetType
        );
      }
    };
    plusButton.className = `w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl font-bold hover:bg-green-600 transition-colors`;
    setTextContent(plusButton, '+');

    appendChild(buttonsContainer, minusButton);
    appendChild(buttonsContainer, plusButton);

    const progressContainer = createElement(document, 'div');
    progressContainer.className = 'w-full bg-gray-200 rounded-full h-2 mt-3';

    const progressBar = createElement(document, 'div');
    progressBar.className = `habit-${item.id}-progress h-2 rounded-full bg-red-500 transition-all duration-500`;
    setStyle(progressBar, 'width', '0%');

    appendChild(progressContainer, progressBar);

    const countText = createElement(document, 'div');
    setAttribute(countText, 'id', `habit-${item.id}-count-text`);
    countText.className = 'text-xs text-gray-500 mt-1';
    setTextContent(countText, `${item.history.length} / ${item.maxValue}`);

    appendChild(itemElement, icon);
    appendChild(itemElement, name);
    appendChild(itemElement, buttonsContainer);
    appendChild(itemElement, progressContainer);
    appendChild(itemElement, countText);

    appendChild(container, itemElement);
  });
  if (!isSSR) {
    createIcons({ icons });
  }
}

/**
 * Renders consumption list in modal
 * @param modalId - ID of the modal element
 * @param scope - Document or element scope for DOM operations
 */
function renderConsumptionList(
  widgetId: string,
  modalId: string,
  scope: Document | HTMLElement = document
): void {
  const listElement = getElementById(scope, `${modalId}-consumption-list`);
  if (!listElement) return;

  // Clear the list
  clearChildren(listElement);

  // Combine and sort all consumption by time
  const allConsumption: (HabitHistoryEntry & {
    type: string;
    typeName: string;
    color: string;
  })[] = [];
  habitItems[widgetId]?.forEach(item => {
    item.history?.forEach(entry => {
      allConsumption.push({
        ...entry,
        type: item.id,
        typeName: item.name,
        color: item.color,
      });
    });
  });

  allConsumption.sort((a, b) => b.id.localeCompare(a.id));

  // Show/hide no consumption message
  const noConsumptionMessage = getElementById(
    scope,
    `${modalId}-no-consumption-message`
  );
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
      'flex items-center justify-between p-3 rounded-lg bg-gray-50 mb-2';

    const iconContainer = createElement(document, 'div');
    iconContainer.className = 'flex items-center';

    const icon = createElement(document, 'i');
    const itemIcon =
      habitItems[widgetId].find(i => i.id === item.type)?.icon || 'circle';
    setAttribute(icon, 'data-lucide', itemIcon);
    icon.className = `w-5 h-5 mr-3 text-${item.color}-500`;

    const text = createElement(document, 'span');
    text.className = 'text-gray-700';
    setTextContent(text, `${item.typeName} at ${item.time}`);

    appendChild(iconContainer, icon);
    appendChild(iconContainer, text);

    appendChild(listItem, iconContainer);
    appendChild(listElement, listItem);
  });
  if (!isSSR) {
    createIcons({ icons });
  }
}

/**
 * Renders consumption list for widget (simplified version)
 */
function renderConsumptionListForWidget(): void {
  // This is a simplified version for the widget itself, not used in modal
  // In the widget context, we don't need to render the full consumption list
  // This function exists to satisfy the call from addItem and removeItem
}

/**
 * Initializes tracking items
 * @param scope - Document or element scope for DOM operations
 */
function initTrackingItems(
  widgetId: string,
  scope: Document | HTMLElement = document
): void {
  // Update widget display to show all items
  updateWidgetDisplay(widgetId, scope);
  updateTrackingCounts(widgetId, scope);
}

/**
 * Shows the habits modal for a specific widget
 * @param modalId - ID of the modal element
 * @param scope - Document or element scope for DOM operations
 */
export function showHabitsModal(
  widgetId: string,
  modalId: string,
  scope: Document | HTMLElement = document
): void {
  const modal = getElementById(scope, modalId);
  if (modal) {
    modal.classList.remove('hidden', 'opacity-0');
    modal.classList.add('opacity-100');
    addClass(document.body, 'overflow-hidden');

    // Add click event listener to close modal when clicking on background
    const closeModalOnBackgroundClick = (event: Event) => {
      if (event.target === modal) {
        hideHabitsModal(modalId, scope);
      }
    };

    // Store the event listener so we can remove it later
    (modal as any).closeModalOnBackgroundClick = closeModalOnBackgroundClick;
    modal.addEventListener('click', closeModalOnBackgroundClick);

    renderModalItems(widgetId, modalId, scope);
    renderConsumptionList(widgetId, modalId, scope);
    updateTrackingCounts(widgetId, scope);

    // Show/hide no consumption message
    const noConsumptionMessage = getElementById(
      scope,
      `${modalId}-no-consumption-message`
    );
    const consumptionList = getElementById(
      scope,
      `${modalId}-consumption-list`
    );
    if (noConsumptionMessage && consumptionList) {
      // Check if any item has history
      const hasConsumption = habitItems[widgetId].some(
        item => item.history.length > 0
      );
      setStyle(
        noConsumptionMessage,
        'display',
        hasConsumption ? 'none' : 'block'
      );
      setStyle(consumptionList, 'display', hasConsumption ? 'block' : 'none');
    }
    if (!isSSR) {
      createIcons({ icons });
    }
  }
}

/**
 * Hides the habits modal for a specific widget
 * @param modalId - ID of the modal element
 * @param scope - Document or element scope for DOM operations
 */
export function hideHabitsModal(
  modalId: string,
  scope: Document | HTMLElement = document
): void {
  const modal = getElementById(scope, modalId);
  if (modal) {
    // Remove the event listener
    if ((modal as any).closeModalOnBackgroundClick) {
      modal.removeEventListener(
        'click',
        (modal as any).closeModalOnBackgroundClick
      );
      delete (modal as any).closeModalOnBackgroundClick;
    }

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
    removeClass(document.body, 'overflow-hidden');
  }
}

/**
 * Switches between tabs in the habits modal
 * @param modalId - ID of the modal element
 * @param tabName - Name of the tab to switch to ('counters' or 'history')
 * @param scope - Document or element scope for DOM operations
 */
function switchHabitsTab(
  modalId: string,
  tabName: 'counters' | 'history',
  scope: Document | HTMLElement = document
): void {
  // Hide all tab contents
  const countersTab = getElementById(scope, `${modalId}-counters-tab`);
  const historyTab = getElementById(scope, `${modalId}-history-tab`);

  if (countersTab) {
    if (tabName === 'counters') {
      removeClass(countersTab, 'hidden');
    } else {
      addClass(countersTab, 'hidden');
    }
  }

  if (historyTab) {
    if (tabName === 'history') {
      removeClass(historyTab, 'hidden');
    } else {
      addClass(historyTab, 'hidden');
    }
  }

  // Update tab button styles
  const tabButtons = scope.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    removeClass(
      button as HTMLElement,
      'text-pastel-blue',
      'border-pastel-blue'
    );
    addClass(button as HTMLElement, 'text-gray-700', 'border-transparent');
  });

  // Highlight active tab button
  const activeButton = scope.querySelector(`button[onclick*="'${tabName}'"]`);
  if (activeButton) {
    removeClass(
      activeButton as HTMLElement,
      'text-gray-700',
      'border-transparent'
    );
    addClass(
      activeButton as HTMLElement,
      'text-pastel-blue',
      'border-pastel-blue'
    );
  }
}

export const linkFunctionsToWindow = (): void => {
  // Export all utility functions
  if (WINDOW) {
    WINDOW.addItem = addItem;
    WINDOW.removeItem = removeItem;
    WINDOW.updateTrackingCounts = updateTrackingCounts;
    WINDOW.updateWidgetDisplay = updateWidgetDisplay;
    WINDOW.renderModalItems = renderModalItems;
    WINDOW.renderConsumptionList = renderConsumptionList;
    WINDOW.initTrackingItems = initTrackingItems;
    WINDOW.showHabitsModal = showHabitsModal;
    WINDOW.hideHabitsModal = hideHabitsModal;
    WINDOW.switchHabitsTab = switchHabitsTab; // Add the new function
  }
};
