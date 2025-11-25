/**
 * Client-side JavaScript for handling clock widget updates
 * This replicates the functionality from gemini-template.html
 */
/* global document, window, setInterval, clearInterval */

// Global variables for clock management
let clockUpdateInterval = null;
let timeZoneClocks = [];

/**
 * Initializes the clock widget with the provided configuration
 * @param {Array} clocks - Array of clock configurations
 */
function initializeClockWidget(clocks) {
  timeZoneClocks = clocks.map(clock => ({
    name: clock.label,
    timezone: getTimezoneFromOffset(clock.timezone),
    color: getColorForClock(clock.label)
  }));
  
  setupClockInterval(true);
}

/**
 * Converts timezone offset to IANA timezone identifier
 * @param {string} offset - Timezone offset (e.g., "-8", "3.5")
 * @returns {string} IANA timezone identifier
 */
function getTimezoneFromOffset(offset) {
  const TIMEZONE_OFFSET_TO_IANA = {
    '-12': 'Etc/GMT+12',
    '-11': 'Pacific/Midway',
    '-10': 'Pacific/Honolulu',
    '-9': 'America/Anchorage',
    '-8': 'America/Los_Angeles',
    '-7': 'America/Denver',
    '-6': 'America/Chicago',
    '-5': 'America/New_York',
    '-4': 'America/Halifax',
    '-3.5': 'America/St_Johns',
    '-3': 'America/Argentina/Buenos_Aires',
    '-2': 'America/Noronha',
    '-1': 'Atlantic/Azores',
    '0': 'Etc/UTC',
    '1': 'Europe/Paris',
    '2': 'Europe/Kaliningrad',
    '3': 'Europe/Moscow',
    '3.5': 'Asia/Tehran',
    '4': 'Asia/Baku',
    '4.5': 'Asia/Kabul',
    '5': 'Asia/Karachi',
    '5.5': 'Asia/Kolkata',
    '5.75': 'Asia/Kathmandu',
    '6': 'Asia/Dhaka',
    '7': 'Asia/Bangkok',
    '8': 'Asia/Shanghai',
    '9': 'Asia/Tokyo',
    '9.5': 'Australia/Darwin',
    '10': 'Australia/Sydney',
    '11': 'Pacific/Guadalcanal',
    '12': 'Pacific/Auckland',
  };
  
  return TIMEZONE_OFFSET_TO_IANA[offset] || 'Etc/UTC';
}

/**
 * Gets a color for the clock based on its name/position
 * @param {string} name - Clock name
 * @returns {string} Color hex code
 */
function getColorForClock(name) {
  const colors = ['#8A89F0', '#F5A2C0', '#A2F5C0', '#A2C0F5', '#FF988A'];
  // Find index in the global timeZoneClocks array
  const index = timeZoneClocks.findIndex(clock => clock && clock.name === name);
  return colors[index % colors.length] || '#8A89F0';
}

/**
 * Gets digital time for a timezone
 * @param {string} timezone - IANA timezone identifier
 * @returns {string} Formatted time string (HH:MM)
 */
function getDigitalTime(timezone) {
  try {
    const date = new Date();
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timezone
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (_error) { // eslint-disable-line no-unused-vars,@typescript-eslint/no-unused-vars
    return '--:--';
  }
}

/**
 * Draws an analog clock on a canvas
 * @param {string} canvasId - ID of the canvas element
 * @param {string} timezone - IANA timezone identifier
 * @param {string} color - Color for the clock hands
 */
function drawAnalogClock(canvasId, timezone, color = '#8A89F0') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // Set canvas size for high pixel density
  const size = canvas.clientWidth;
  const scale = window.devicePixelRatio || 1;
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  const radius = size / 2;
  ctx.clearRect(0, 0, size, size);
  ctx.translate(radius, radius);

  const now = new Date();
  const timeZoneString = now.toLocaleString('en-US', { timeZone: timezone });
  const localTime = new Date(timeZoneString);
  
  let hours = localTime.getHours();
  let minutes = localTime.getMinutes();
  
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
  ctx.font = radius * 0.15 + "px Inter";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;

  numbers.forEach(num => {
    const angle = (num === 12 ? 0 : num) * Math.PI / 6;
    const x = radius * 0.85 * Math.sin(angle);
    const y = -radius * 0.85 * Math.cos(angle);
    ctx.fillText(num.toString(), x, y);
  });
  
  // Draw clock hands
  function drawHand(ctx, pos, length, width, style) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = style;
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  }
  
  // Hours
  hours = hours % 12;
  let hourPos = (hours * Math.PI / 6) + (minutes * Math.PI / (6 * 60));
  drawHand(ctx, hourPos, radius * 0.5, radius * 0.07, color);

  // Minutes
  let minutePos = (minutes * Math.PI / 30);
  drawHand(ctx, minutePos, radius * 0.8, radius * 0.05, color);

  // Center dot
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.translate(-radius, -radius);
}

/**
 * Updates all clocks in the UI
 */
function updateClocksUI() {
  const visibleClocks = timeZoneClocks.slice(0, 3);
  
  // Main clock (Widget)
  if (visibleClocks[0]) {
    const mainClock = visibleClocks[0];
    const mainClockId = mainClock.name.replace(/\s+/g, '-');
    
    const timeElement = document.getElementById(`main-clock-time-${mainClockId}`);
    const nameElement = document.getElementById(`main-clock-name-${mainClockId}`);
    const canvasElement = document.getElementById(`main-analog-clock-${mainClockId}`);
    
    if (timeElement) {
      timeElement.textContent = getDigitalTime(mainClock.timezone);
    }
    if (nameElement) {
      nameElement.textContent = mainClock.name;
      nameElement.style.color = mainClock.color;
    }
    
    // Update analog clock
    if (canvasElement) {
      drawAnalogClock(`main-analog-clock-${mainClockId}`, mainClock.timezone, mainClock.color);
    }
  }
  
  // Small clocks 1 and 2 (Widget)
  for (let i = 1; i < Math.min(3, visibleClocks.length); i++) {
    const clock = visibleClocks[i];
    const clockId = clock.name.replace(/\s+/g, '-');
    
    const timeElement = document.getElementById(`small-clock-time-${i}-${clockId}`);
    const nameElement = document.getElementById(`small-clock-name-${i}-${clockId}`);
    
    if (timeElement) {
      timeElement.textContent = getDigitalTime(clock.timezone);
    }
    if (nameElement) {
      nameElement.textContent = clock.name.split('(')[0].trim();
    }
  }
}

/**
 * Rotates the clocks array (moves first element to the end)
 */
function rotateClocks(event) {
  if (event) {
    event.stopPropagation();
  }
  
  if (timeZoneClocks.length > 1) {
    const firstClock = timeZoneClocks.shift();
    timeZoneClocks.push(firstClock);
    updateClocksUI();
  }
}

/**
 * Sets up or stops the clock update interval
 * @param {boolean} shouldStart - Whether to start or stop the interval
 */
function setupClockInterval(shouldStart) {
  if (clockUpdateInterval) {
    clearInterval(clockUpdateInterval);
    clockUpdateInterval = null;
  }
  if (shouldStart) {
    updateClocksUI();
    clockUpdateInterval = setInterval(updateClocksUI, 1000);
  }
}

// Export functions for use in other modules
// eslint-disable-next-line no-undef
if (typeof module !== 'undefined' && module.exports) {
  // eslint-disable-next-line no-undef
  module.exports = {
    initializeClockWidget,
    setupClockInterval,
    rotateClocks
  };
}
