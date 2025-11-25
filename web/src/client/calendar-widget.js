/**
 * Client-side JavaScript for handling calendar widget updates
 * This replicates the functionality from gemini-template.html
 */
/* global document */

/**
 * Gets monthly progress information
 * @returns {Object} Object containing currentDay, lastDay, and progress percentage
 */
function getMonthlyProgress() {
  const today = new Date();
  const currentDay = today.getDate();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const progress = (currentDay / lastDay) * 100;
  return { currentDay, lastDay, progress: progress.toFixed(1) };
}

/**
 * Updates the date widget with current date and progress information
 */
function updateDateWidget() {
  const { progress } = getMonthlyProgress();
  const today = new Date();
  
  const dateElement = document.getElementById('monthly-progress-date');
  const progressElement = document.getElementById('monthly-progress-value');
  const progressTextElement = document.getElementById('monthly-progress-text');

  if (dateElement) {
    dateElement.textContent = today.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long' 
    });
  }
  
  if (progressElement) {
    progressElement.style.width = `${progress}%`;
  }
  
  if (progressTextElement) {
    progressTextElement.textContent = `${progress}% of month passed`;
  }
}

/**
 * Renders calendar days in the modal
 */
function renderCalendarDays() {
  const calendarContainer = document.getElementById('calendar-grid');
  const monthTitle = document.getElementById('calendar-month-title');
  if (!calendarContainer || !monthTitle) return;

  calendarContainer.innerHTML = '';
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDay = today.getDate();

  const monthName = today.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
  monthTitle.textContent = monthName;

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; 
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'text-center p-2';
    calendarContainer.appendChild(emptyCell);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= lastDay; day++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'text-center p-2 rounded-lg font-medium transition-colors duration-200';
    dayCell.textContent = day;

    if (day < currentDay) {
      dayCell.classList.add('bg-pastel-blue/20', 'text-gray-800', 'dark:bg-pastel-blue/50');
    } else if (day === currentDay) {
      dayCell.classList.add('bg-pastel-blue', 'text-white', 'font-bold', 'long-shadow');
      dayCell.style.boxShadow = '5px 5px 0 0 rgba(138, 137, 240, 0.4)';
    } else {
      dayCell.classList.add('text-gray-600', 'dark:text-gray-400');
    }

    calendarContainer.appendChild(dayCell);
  }
}

// Export functions for use in other modules
// eslint-disable-next-line no-undef
if (typeof module !== 'undefined' && module.exports) {
  // eslint-disable-next-line no-undef
  module.exports = {
    updateDateWidget,
    renderCalendarDays
  };
}