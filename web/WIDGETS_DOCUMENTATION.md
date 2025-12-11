# Widgets Documentation for "My Dashboard" Project

## Overview

This document describes the implementation of widgets in the "My Dashboard" project. Currently, one widget has been implemented - the Habits Tracking Widget, which allows users to track their daily habits and activities.

## Implemented Widgets

### Habits Tracking Widget

The Habits Tracking Widget allows users to track their daily habits and activities through an interactive interface.

#### Widget Features:

1. **Dashboard Display**:
   - Compact representation with icons for the first 3 habits
   - Progress bars for each habit
   - Current value counters
   - Ability to expand to full interface on click

2. **Modal Window**:
   - Tabs: "Counters" and "History"
   - Interactive +/- buttons to increase/decrease values
   - Progress visualization with color indication
   - Consumption history with timestamps

3. **Supported Habit Types**:
   - Water (droplet)
   - Food (utensils)
   - Medication (pill)
   - Exercise (dumbbell)
   - Coffee (coffee)
   - Glass of water (glass-water)
   - Apple (apple)
   - Weight (weight)
   - Heart rate (heart-pulse)
   - Mindfulness (brain)
   - Reading (book)
   - Music (music)
   - TV/Movies (tv)
   - Gaming (gamepad)
   - Sleep (bed)
   - Sun (sun)
   - Moon (moon)
   - Star (star)
   - Smile (smile)
   - Activity (activity)

4. **Color Schemes**:
   - Blue (blue)
   - Orange (orange)
   - Purple (purple)
   - Green (green)
   - Red (red)
   - Yellow (yellow)
   - Pink (pink)

#### Technical Implementation:

##### Implementation Files:
- `web/src/server/widgets/habits-widget.ts` - Main widget class and display template
- `web/src/server/widgets/habits-widget.utils.ts` - Client-side helper functions

##### Data Structure:
```typescript
interface HabitsWidgetItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  minValue: number;
  maxValue: number;
  currentValue: number;
  history: Array<{
    id: number;
    time: string;
  }>;
}
```

##### Main Functions:
- `showHabitsModal(modalId)` - Display modal window
- `hideHabitsModal(modalId)` - Hide modal window
- `addItem(itemId)` - Increase habit value
- `removeItem(itemId)` - Decrease habit value
- `switchHabitsTab(modalId, tabName)` - Switch between tabs
- `renderConsumptionList(modalId)` - Display consumption history

#### System Integration:

The widget is integrated with the general widget system of the project and uses the following components:
- Zod schemas for data validation
- Formly for widget configuration form
- Lucide Icons for icons
- Tailwind CSS for styling

#### Widget Configuration Example:

```json
{
  "type": "habits",
  "name": "Daily Habits",
  "items": [
    {
      "id": "water",
      "name": "Water",
      "icon": "droplet",
      "color": "blue",
      "minValue": 0,
      "maxValue": 8,
      "currentValue": 0,
      "history": []
    }
  ]
}
```

## Widgets Development Roadmap

### Near-term Tasks:
1. Implementation of additional widgets (clock, calendar)
2. Improvement of widget configuration system
3. Adding ability to save widget states in the database
4. Implementation of widget change logging system

### Long-term Goals:
1. Creation of an extensible widget system with ability to add new types
2. Implementation of widget sharing mechanism between users
3. Addition of notification system for widgets
4. Creation of mobile interface for interacting with widgets

## Troubleshooting

### Known Issues:
1. Some Tailwind CSS color classes are not automatically generated for custom colors
2. Some functions require global scope to work correctly

### Recommendations:
1. When adding new colors, ensure they display correctly in Tailwind CSS
2. When developing new widgets, follow established implementation patterns
3. Use provided utilities for DOM manipulation instead of direct element access