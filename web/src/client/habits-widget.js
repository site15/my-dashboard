/**
 * Client-side JavaScript for handling habits tracking widget
 * This replicates the functionality from gemini-template.html
 */
/* global document, lucide */

// Global variable for habit items
let habitItems = [
  { 
    id: 'water', 
    name: 'Water', 
    icon: 'droplet', 
    color: 'blue', 
    minValue: 0, 
    maxValue: 8, 
    currentValue: 0,
    history: []
  },
  { 
    id: 'food', 
    name: 'Food', 
    icon: 'utensils', 
    color: 'orange', 
    minValue: 0, 
    maxValue: 5, 
    currentValue: 0,
    history: []
  },
  { 
    id: 'medication', 
    name: 'Medication', 
    icon: 'pill', 
    color: 'purple', 
    minValue: 0, 
    maxValue: 5, 
    currentValue: 0,
    history: []
  },
  { 
    id: 'exercise', 
    name: 'Exercise', 
    icon: 'dumbbell', 
    color: 'green', 
    minValue: 0, 
    maxValue: 3, 
    currentValue: 0,
    history: []
  }
];

/**
 * Initializes the habits widget with provided items
 * @param {Array} items - Array of habit items
 */
function initializeHabitsWidget(items) {
  if (items && items.length > 0) {
    habitItems = items;
  }
  updateWidgetDisplay();
  updateTrackingCounts();
}

/**
 * Adds an item consumption
 * @param {string} itemId - ID of the item to increment
 */
function addItem(itemId) {
  const item = habitItems.find(i => i.id === itemId);
  if (!item) return;
  
  // Increment current value if not at max
  if (item.currentValue < item.maxValue) {
    item.currentValue++;
    
    // Add to history
    const now = new Date();
    item.history.push({
      id: Date.now(),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });
    
    updateTrackingCounts();
    renderConsumptionList();
    updateProgressBar(itemId);
  }
}

/**
 * Removes last item consumption
 * @param {string} itemId - ID of the item to decrement
 */
function removeItem(itemId) {
  const item = habitItems.find(i => i.id === itemId);
  if (!item || item.currentValue <= item.minValue) return;
  
  // Decrement current value
  item.currentValue--;
  
  // Remove from history
  if (item.history.length > 0) {
    item.history.pop();
  }
  
  updateTrackingCounts();
  renderConsumptionList();
  updateProgressBar(itemId);
}

/**
 * Updates progress bar color based on value
 * @param {string} itemId - ID of the item to update
 */
function updateProgressBar(itemId) {
  const item = habitItems.find(i => i.id === itemId);
  if (!item) return;
  
  const progressBar = document.getElementById(`${itemId}-progress`);
  if (!progressBar) return;
  
  // Calculate percentage
  const percentage = ((item.currentValue - item.minValue) / (item.maxValue - item.minValue)) * 100;
  
  // Set width
  progressBar.style.width = `${percentage}%`;
  
  // Set color based on value
  if (percentage <= 33) {
    // Red (minimum)
    progressBar.className = 'h-2 rounded-full bg-red-500 transition-all duration-500';
  } else if (percentage <= 66) {
    // Blue (medium)
    progressBar.className = 'h-2 rounded-full bg-blue-500 transition-all duration-500';
  } else {
    // Green (maximum)
    progressBar.className = 'h-2 rounded-full bg-green-500 transition-all duration-500';
  }
  
  // Update the text display for current/max
  const textElement = document.getElementById(`${itemId}-count-text`);
  if (textElement) {
    textElement.textContent = `${item.currentValue} / ${item.maxValue}`;
  }
}

/**
 * Updates counts display
 */
function updateTrackingCounts() {
  habitItems.forEach(item => {
    const countElement = document.getElementById(`${item.id}-count`);
    if (countElement) {
      countElement.textContent = item.currentValue;
    }
    
    // Update progress bar
    updateProgressBar(item.id);
  });
}

/**
 * Updates widget display to show all items
 */
function updateWidgetDisplay() {
  const widgetContent = document.getElementById('habits-widget-content');
  if (!widgetContent) return;
  
  // Clear existing content
  widgetContent.innerHTML = '';
  
  // Create container for top 3 items with icons and progress
  const topItemsContainer = document.createElement('div');
  topItemsContainer.className = 'grid grid-cols-3 gap-2 mt-2';
  
  // Create container for remaining items as simple text
  const remainingItemsContainer = document.createElement('div');
  remainingItemsContainer.className = 'flex flex-wrap gap-3 mt-2 text-sm';
  
  // Process items
  habitItems.forEach((item, index) => {
    if (index < 3) {
      // Top 3 items with icons and progress
      const itemElement = document.createElement('div');
      itemElement.className = 'flex flex-col items-center';
      
      // Icon and count container
      const iconCountContainer = document.createElement('div');
      iconCountContainer.className = 'flex items-center justify-center w-8 h-8 mb-1';
      
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', item.icon);
      icon.className = `w-5 h-5 text-${item.color}-500`;
      
      const count = document.createElement('span');
      count.className = 'text-lg font-bold text-gray-800 ml-1';
      count.id = `${item.id}-count`;
      count.textContent = item.currentValue;
      
      iconCountContainer.appendChild(icon);
      iconCountContainer.appendChild(count);
      
      const label = document.createElement('p');
      label.className = 'text-xs text-gray-500 text-center';
      label.textContent = item.name;
      
      const progressContainer = document.createElement('div');
      progressContainer.className = 'w-full bg-gray-200 rounded-full h-1.5 mt-1';
      
      const progressBar = document.createElement('div');
      progressBar.id = `${item.id}-progress`;
      progressBar.className = 'h-1.5 rounded-full bg-red-500 transition-all duration-500';
      progressBar.style.width = '0%';
      
      progressContainer.appendChild(progressBar);
      
      itemElement.appendChild(iconCountContainer);
      itemElement.appendChild(label);
      itemElement.appendChild(progressContainer);
      
      topItemsContainer.appendChild(itemElement);
    } else {
      // Remaining items as simple text
      const itemElement = document.createElement('div');
      itemElement.className = 'flex items-center';
      
      const text = document.createElement('span');
      text.className = 'text-gray-600';
      text.textContent = `${item.name}: `;
      
      const value = document.createElement('span');
      value.className = 'font-bold text-gray-800';
      value.id = `${item.id}-count`;
      value.textContent = item.currentValue;
      
      itemElement.appendChild(text);
      itemElement.appendChild(value);
      
      remainingItemsContainer.appendChild(itemElement);
    }
  });
  
  widgetContent.appendChild(topItemsContainer);
  if (habitItems.length > 3) {
    widgetContent.appendChild(remainingItemsContainer);
  }
  
  // Refresh Lucide icons
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

/**
 * Renders modal items dynamically
 */
function renderModalItems() {
  const container = document.getElementById('habits-items-container');
  if (!container) return;
  
  // Clear existing content
  container.innerHTML = '';
  
  // Set up grid
  container.className = 'grid gap-4 mb-8';
  
  // Determine grid columns based on number of items
  if (habitItems.length <= 2) {
    container.classList.add('grid-cols-2');
  } else if (habitItems.length <= 4) {
    container.classList.add('grid-cols-2', 'sm:grid-cols-4');
  } else {
    container.classList.add('grid-cols-2', 'sm:grid-cols-3');
  }
  
  // Add each item to the modal
  habitItems.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = `bg-${item.color}-50 dark:bg-${item.color}-900/30 p-4 rounded-2xl flex flex-col items-center`;
    
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', item.icon);
    icon.className = `w-8 h-8 text-${item.color}-500 mb-3`;
    
    const name = document.createElement('h3');
    name.className = 'text-lg font-bold text-gray-800 dark:text-white mb-4';
    name.textContent = item.name;
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'flex gap-3';
    
    const minusButton = document.createElement('button');
    minusButton.onclick = () => removeItem(item.id);
    minusButton.className = 'w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center text-2xl font-bold hover:bg-red-600 transition-colors';
    minusButton.textContent = '-';
    
    const plusButton = document.createElement('button');
    plusButton.onclick = () => addItem(item.id);
    plusButton.className = `w-12 h-12 rounded-full bg-${item.color}-500 text-white flex items-center justify-center text-2xl font-bold hover:bg-${item.color}-600 transition-colors`;
    plusButton.textContent = '+';
    
    buttonsContainer.appendChild(minusButton);
    buttonsContainer.appendChild(plusButton);
    
    const progressContainer = document.createElement('div');
    progressContainer.className = 'w-full bg-gray-200 rounded-full h-2 mt-3';
    
    const progressBar = document.createElement('div');
    progressBar.id = `${item.id}-progress`;
    progressBar.className = 'h-2 rounded-full bg-red-500 transition-all duration-500';
    progressBar.style.width = '0%';
    
    progressContainer.appendChild(progressBar);
    
    const countText = document.createElement('div');
    countText.id = `${item.id}-count-text`;
    countText.className = 'text-xs text-gray-500 mt-1';
    countText.textContent = `${item.currentValue} / ${item.maxValue}`;
    
    itemElement.appendChild(icon);
    itemElement.appendChild(name);
    itemElement.appendChild(buttonsContainer);
    itemElement.appendChild(progressContainer);
    itemElement.appendChild(countText);
    
    container.appendChild(itemElement);
  });
  
  // Refresh Lucide icons
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

/**
 * Renders consumption list in modal
 */
function renderConsumptionList() {
  const listElement = document.getElementById('consumption-list');
  if (!listElement) return;

  // Clear the list
  listElement.innerHTML = '';

  // Combine and sort all consumption by time
  let allConsumption = [];
  habitItems.forEach(item => {
    item.history.forEach(entry => {
      allConsumption.push({
        ...entry,
        type: item.id,
        typeName: item.name,
        color: item.color
      });
    });
  });
  
  allConsumption.sort((a, b) => b.id - a.id);

  // Show/hide no consumption message
  const noConsumptionMessage = document.getElementById('no-consumption-message');
  if (noConsumptionMessage) {
    noConsumptionMessage.style.display = allConsumption.length > 0 ? 'none' : 'block';
  }
  listElement.style.display = allConsumption.length > 0 ? 'block' : 'none';

  // Create list items
  allConsumption.forEach(item => {
    const listItem = document.createElement('div');
    listItem.className = 'flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 mb-2';
    
    const iconContainer = document.createElement('div');
    iconContainer.className = 'flex items-center';
    
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', habitItems.find(i => i.id === item.type)?.icon || 'circle');
    icon.className = `w-5 h-5 mr-3 text-${item.color}-500`;
    
    const text = document.createElement('span');
    text.className = 'text-gray-700 dark:text-gray-300';
    text.textContent = `${item.typeName} at ${item.time}`;
    
    iconContainer.appendChild(icon);
    iconContainer.appendChild(text);
    
    listItem.appendChild(iconContainer);
    listElement.appendChild(listItem);
  });

  // Refresh Lucide icons
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

/**
 * Initializes tracking items
 */
function initTrackingItems() {
  // Update widget display to show all items
  updateWidgetDisplay();
  updateTrackingCounts();
}

// Export functions for use in other modules
// eslint-disable-next-line no-undef
if (typeof module !== 'undefined' && module.exports) {
  // eslint-disable-next-line no-undef
  module.exports = {
    initializeHabitsWidget,
    addItem,
    removeItem,
    updateTrackingCounts,
    updateWidgetDisplay,
    renderModalItems,
    renderConsumptionList,
    initTrackingItems
  };
}