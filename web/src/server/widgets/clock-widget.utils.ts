/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Client-side TypeScript for handling clock widget updates
 * This replicates the functionality from gemini-template.html
 */
/* global document, setInterval, clearInterval*/

import { createIcons, icons } from 'lucide';

import { WINDOW } from '../../app/utils/window';
import {
  addClass,
  appendChild,
  createElement,
  getElementById,
  removeClass,
  setStyle,
  setTextContent,
} from '../utils/dom-utils';
import { isSSR } from '../utils/is-ssr';
import { getTimezoneFromOffset } from '../utils/timezones';

// Global variables for clock management
const timeZoneClocks: Record<
  string,
  Array<{ name: string; timezone: string; color: string }>
> = {};

let clockUpdateInterval: NodeJS.Timeout | null = null;

// Type definitions
interface ClockConfig {
  name: string;
  timezone: string;
  color?: string;
}

/**
 * Initializes the clock widget with the provided configuration
 * @param clocks - Array of clock configurations
 * @param scope - Document or element scope for DOM operations
 */
function initializeClockWidget(
  widgetId: string,
  clocks: ClockConfig[],
  staticMode: boolean,
  scope: Document | HTMLElement = document
): void {
  timeZoneClocks[widgetId] = [];

  for (let i = 0; i < clocks.length; i++) {
    timeZoneClocks[widgetId].push({
      name: clocks[i].name,
      timezone: getTimezoneFromOffset(clocks[i].timezone),
      color: getColorForClock(i),
    });
  }

  console.log(timeZoneClocks[widgetId]);

  setupClockInterval(widgetId, true, staticMode, scope);
}

/**
 * Gets a color for the clock based on its name/position
 * @param name - Clock name
 * @returns Color hex code
 */
function getColorForClock(index: number): string {
  const colors = ['#8A89F0', '#F5A2C0', '#A2F5C0', '#A2C0F5', '#FF988A'];
  return colors[index];
}

/**
 * Gets digital time for a timezone
 * @param timezone - IANA timezone identifier
 * @returns Formatted time string (HH:MM)
 */
function getDigitalTime(timezone: string): string {
  try {
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

/**
 * Draws an analog clock on a canvas
 * @param canvasId - ID of the canvas element
 * @param timezone - IANA timezone identifier
 * @param color - Color for the clock hands
 * @param scope - Document or element scope for DOM operations
 */
function drawAnalogClock(
  canvasId: string,
  timezone: string,
  color: string,
  scope: Document | HTMLElement = document
): void {
  const canvas = getElementById(scope, canvasId);
  if (!canvas) return;

  // Set canvas size for high pixel density
  const size = canvas.clientWidth;
  const scale = window.devicePixelRatio || 1;
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(scale, scale);

  const radius = size / 2;
  ctx.clearRect(0, 0, size, size);
  ctx.translate(radius, radius);

  const now = new Date();
  const timeZoneString = now.toLocaleString('en-US', { timeZone: timezone });
  const localTime = new Date(timeZoneString);

  let hours = localTime.getHours();
  const minutes = localTime.getMinutes();
  const seconds = localTime.getSeconds();

  // Draw clock face
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.95, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255, 255, 255, 0)';
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Draw hour markers
  const numbers = [12, 3, 6, 9];
  ctx.font = radius * 0.15 + 'px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;

  numbers.forEach(num => {
    const angle = ((num === 12 ? 0 : num) * Math.PI) / 6;
    const x = radius * 0.85 * Math.sin(angle);
    const y = -radius * 0.85 * Math.cos(angle);
    ctx.fillText(num.toString(), x, y);
  });

  // Draw clock hands
  function drawHand(
    ctx: CanvasRenderingContext2D,
    pos: number,
    length: number,
    width: number,
    style: string
  ): void {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.strokeStyle = style;
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  }

  // Hours
  hours = hours % 12;
  const hourPos = (hours * Math.PI) / 6 + (minutes * Math.PI) / (6 * 60);
  drawHand(ctx, hourPos, radius * 0.5, radius * 0.07, color);

  // Minutes
  const minutePos = (minutes * Math.PI) / 30;
  drawHand(ctx, minutePos, radius * 0.8, radius * 0.05, color);

  // Seconds
  const secondPos = (seconds * Math.PI) / 30;
  drawHand(ctx, secondPos, radius * 0.8, radius * 0.03, color);

  // Center dot
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.translate(-radius, -radius);
}

/**
 * Updates all clocks in the UI
 * @param scope - Document or element scope for DOM operations
 */
function updateClocksUI(
  widgetId: string,
  scope: Document | HTMLElement = document
): void {
  const visibleClocks = timeZoneClocks[widgetId].slice(0, 3);

  // Main clock (Widget)
  if (visibleClocks[0]) {
    const mainClock = visibleClocks[0];
    const mainClockId = getClockName(widgetId, 'main');

    const timeElement = getElementById(scope, `main-clock-time-${mainClockId}`);
    const nameElement = getElementById(scope, `main-clock-name-${mainClockId}`);
    const canvasElement = getElementById(
      scope,
      `main-analog-clock-${mainClockId}`
    );

    console.log({
      timeElement,
      nameElement,
      canvasElement,
    });

    if (timeElement) {
      setTextContent(timeElement, getDigitalTime(mainClock.timezone));
    }
    if (nameElement) {
      setTextContent(nameElement, mainClock.name);
      setStyle(nameElement, 'color', mainClock.color);
    }

    // Update analog clock
    if (canvasElement) {
      drawAnalogClock(
        `main-analog-clock-${mainClockId}`,
        mainClock.timezone,
        mainClock.color,
        scope
      );
    }
  }

  // Small clocks 1 and 2 (Widget)
  for (let i = 1; i < Math.min(3, visibleClocks.length); i++) {
    const clock = visibleClocks[i];
    const clockId = getClockName(widgetId, `small${i}`);

    const timeElement = getElementById(scope, `small-clock-time-${clockId}`);
    const nameElement = getElementById(scope, `small-clock-name-${clockId}`);

    if (timeElement) {
      setTextContent(timeElement, getDigitalTime(clock.timezone));
    }
    if (nameElement) {
      setTextContent(nameElement, clock.name.split('(')[0].trim());
      setStyle(nameElement, 'color', clock.color);
    }
  }
}

export function getClockName(widgetId: string, name: string) {
  return `clock-${widgetId}-${name.replace(/\s+/g, '-')}`;
}

/**
 * Rotates the clocks array (moves first element to the end)
 * @param event - Click event
 * @param scope - Document or element scope for DOM operations
 */
function rotateClocks(
  modalId: string,
  widgetId: string,
  event?: Event,
  scope: Document | HTMLElement = document
): void {
  if (event) {
    event.stopPropagation();
  }

  if (timeZoneClocks[widgetId].length > 1) {
    const firstClock = timeZoneClocks[widgetId].shift();
    if (firstClock) {
      timeZoneClocks[widgetId].push(firstClock);
      console.log(timeZoneClocks);
      updateClocksUI(widgetId, scope);
      renderAllClocksModal(modalId, widgetId);
    }
  }
}

/**
 * Sets up or stops the clock update interval
 * @param shouldStart - Whether to start or stop the interval
 * @param scope - Document or element scope for DOM operations
 */
function setupClockInterval(
  widgetId: string,
  shouldStart: boolean,
  staticMode: boolean,
  scope: Document | HTMLElement = document
): void {
  if (clockUpdateInterval) {
    clearInterval(clockUpdateInterval);
    clockUpdateInterval = null;
  }
  if (shouldStart) {
    updateClocksUI(widgetId, scope);
    if (!staticMode) {
      clockUpdateInterval = setInterval(
        () => updateClocksUI(widgetId, scope),
        1000
      );
    }
  }
}

/**
 * Populates the modal window with all available clocks.
 */
function renderAllClocksModal(
  modalId: string,
  widgetId: string,
  scope: Document | HTMLElement = document
) {
  const modalGrid = getElementById(scope, `${modalId}-all-clocks-grid`);
  console.log({ modalGrid });
  if (!modalGrid) return;

  modalGrid.innerHTML = ''; // Clear

  timeZoneClocks[widgetId].forEach((clock, index) => {
    const clockCard = createElement(scope as Document, 'div');
    clockCard.className =
      'bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex flex-col items-center long-shadow';
    clockCard.innerHTML = `
                    <canvas id="${modalId}-modal-analog-clock-${index}" class="w-20 h-20 mb-2"></canvas>
                    <!-- ID for dynamic time updates -->
                    <p id="${modalId}-modal-clock-time-${index}" class="text-2xl font-extrabold text-gray-800 dark:text-white transition-colors duration-300">--:--</p>
                    <p class="mt-2 text-md font-semibold text-gray-800 dark:text-gray-200 text-center" style="color: ${clock.color}">${clock.name}</p>
                    <p class="text-sm text-gray-500">${clock.timezone.split('/')[1].replace('_', ' ')}</p>
                `;
    appendChild(modalGrid, clockCard);
  });

  // Call immediate update to set time and draw
  updateAllClocksModalTimes(modalId, widgetId);
  // Update total count in modal header
  setTextContent(
    getElementById(scope, `${modalId}-modal-total-clocks`),
    String(timeZoneClocks[widgetId].length)
  );

  // Update button text
  setTimeout(() => {
    const modalButton = getElementById(
      scope,
      `${modalId} button.flat-btn-shadow`
    );
    console.log({
      modalButton,
      c: `${modalId} button.flat-btn-shadow`,
    });
    if (modalButton) {
      setTextContent(
        modalButton,
        `Change Main Clocks (Now: ${timeZoneClocks[widgetId][0].name})`
      );
    }
  });
}

/**
 * Updates time and draws analog clocks for all clocks in the modal window.
 */
function updateAllClocksModalTimes(
  modalId: string,
  widgetId: string,
  scope: Document | HTMLElement = document
) {
  timeZoneClocks[widgetId].forEach((clock, index) => {
    const timeElement = getElementById(
      scope,
      `${modalId}-modal-clock-time-${index}`
    );
    const canvasId = `${modalId}-modal-analog-clock-${index}`;

    if (timeElement) {
      timeElement.textContent = getDigitalTime(clock.timezone);
    }

    // Update analog clocks in modal
    drawAnalogClock(canvasId, clock.timezone, clock.color);
  });
}

export function showClockModal(
  modalId: string,
  widgetId: string,
  scope: Document | HTMLElement = document
) {
  const modal = getElementById(scope, modalId);
  if (modal) {
    modal.classList.remove('hidden', 'opacity-0');
    modal.classList.add('opacity-100');
    addClass(document.body, 'overflow-hidden');

    // Add click event listener to close modal when clicking on background
    const closeModalOnBackgroundClick = (event: Event) => {
      if (event.target === modal) {
        hideClockModal(modalId, widgetId, scope);
      }
    };

    // Store the event listener so we can remove it later
    (modal as any).closeModalOnBackgroundClick = closeModalOnBackgroundClick;
    modal.addEventListener('click', closeModalOnBackgroundClick);

    renderAllClocksModal(modalId, widgetId);
    if (!isSSR) {
      createIcons({ icons });
    }
  }
}

export function hideClockModal(
  modalId: string,
  widgetId: string,
  scope: Document | HTMLElement = document
) {
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

export const linkFunctionsToWindow = (): void => {
  // Export all utility functions
  if (WINDOW) {
    WINDOW.initializeClockWidget = initializeClockWidget;
    WINDOW.rotateClocks = rotateClocks;
    WINDOW.showClockModal = showClockModal;
    WINDOW.hideClockModal = hideClockModal;
  }
};
