/**
 * Client-side TypeScript for handling calendar widget updates
 * This replicates the functionality from gemini-template.html
 */
/* global document */
import { createIcons, icons } from 'lucide';

import { WINDOW } from '../../app/utils/window';
import {
  addClass,
  appendChild,
  clearChildren,
  createElement,
  getElementById,
  removeClass,
  setStyle,
  setTextContent,
} from '../utils/dom-utils';

// Type definitions
interface MonthlyProgress {
  currentDay: number;
  lastDay: number;
  progress: string;
}

/**
 * Gets monthly progress information
 * @returns Object containing currentDay, lastDay, and progress percentage
 */
function getMonthlyProgress(): MonthlyProgress {
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

/**
 * Updates the date widget with current date and progress information
 * @param scope - Document or element scope for DOM operations
 */
function updateDateWidget(scope: Document | HTMLElement = document): void {
  const { progress } = getMonthlyProgress();
  const today = new Date();

  const dateElement = getElementById(scope, 'monthly-progress-date');
  const progressElement = getElementById(scope, 'monthly-progress-value');
  const progressTextElement = getElementById(scope, 'monthly-progress-text');

  if (dateElement) {
    setTextContent(
      dateElement,
      today.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
      })
    );
  }

  if (progressElement) {
    setStyle(progressElement, 'width', `${progress}%`);
  }

  if (progressTextElement) {
    setTextContent(progressTextElement, `${progress}% of month passed`);
  }
}

/**
 * Renders calendar days in the modal
 * @param modalId - ID of the modal element
 * @param scope - Document or element scope for DOM operations
 */
function renderCalendarDays(
  modalId: string,
  scope: Document | HTMLElement = document
): void {
  const calendarContainer = getElementById(scope, `${modalId}-calendar-grid`);
  const monthTitle = getElementById(scope, `${modalId}-calendar-month-title`);
  if (!calendarContainer || !monthTitle) return;

  clearChildren(calendarContainer);
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDay = today.getDate();

  const monthName = today.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  setTextContent(monthTitle, monthName);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    const emptyCell = createElement(document, 'div');
    emptyCell.className = 'text-center p-2';
    appendChild(calendarContainer, emptyCell);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= lastDay; day++) {
    const dayCell = createElement(document, 'div');
    dayCell.className =
      'text-center p-2 rounded-lg font-medium transition-colors duration-200';

    setTextContent(dayCell, day.toString());

    if (day < currentDay) {
      dayCell.classList.add(
        'bg-pastel-blue/20',
        'text-gray-800',
        'dark:bg-pastel-blue/50'
      );
    } else if (day === currentDay) {
      dayCell.classList.add(
        'bg-pastel-blue',
        'text-white',
        'font-bold',
        'long-shadow'
      );
      dayCell.style.boxShadow = '5px 5px 0 0 rgba(138, 137, 240, 0.4)';
    } else {
      dayCell.classList.add('text-gray-600', 'dark:text-gray-400');
    }

    appendChild(calendarContainer, dayCell);
  }
}

/**
 * Shows the calendar modal for a specific widget
 * @param modalId - ID of the modal element
 * @param scope - Document or element scope for DOM operations
 */
export function showCalendarModal(
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
        hideCalendarModal(modalId, scope);
      }
    };
    
    // Store the event listener so we can remove it later
    (modal as any).closeModalOnBackgroundClick = closeModalOnBackgroundClick;
    modal.addEventListener('click', closeModalOnBackgroundClick);

    renderCalendarDays(modalId, scope);

    createIcons({ icons });
  }
}

/**
 * Hides the calendar modal for a specific widget
 * @param modalId - ID of the modal element
 * @param scope - Document or element scope for DOM operations
 */
export function hideCalendarModal(
  modalId: string,
  scope: Document | HTMLElement = document
): void {
  const modal = getElementById(scope, modalId);
  if (modal) {
    // Remove the event listener
    if ((modal as any).closeModalOnBackgroundClick) {
      modal.removeEventListener('click', (modal as any).closeModalOnBackgroundClick);
      delete (modal as any).closeModalOnBackgroundClick;
    }
    
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
    removeClass(document.body, 'overflow-hidden');
  }
}

export const linkFunctionsToWindow = (): void => {
  // Export all utility functions
  if (WINDOW) {
    WINDOW.renderCalendarDays = renderCalendarDays;
    WINDOW.updateDateWidget = updateDateWidget;
    WINDOW.showCalendarModal = showCalendarModal;
    WINDOW.hideCalendarModal = hideCalendarModal;
  }
};