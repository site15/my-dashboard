/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Client-side TypeScript for handling clock widget updates
 * This replicates the functionality from gemini-template.html
 */
/* global document, setInterval, clearInterval */

import { WINDOW } from '../../app/utils/window';
import { getElementById, setStyle, setTextContent } from '../utils/dom-utils';
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
  return `${widgetId}-${name.replace(/\s+/g, '-')}`;
}

/**
 * Rotates the clocks array (moves first element to the end)
 * @param event - Click event
 * @param scope - Document or element scope for DOM operations
 */
function rotateClocks(
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

export const linkFunctionsToWindow = (): void => {
  // Export all utility functions
  if (WINDOW) {
    WINDOW.initializeClockWidget = initializeClockWidget;
    WINDOW.rotateClocks = rotateClocks;
  }
};
