# Widgets Documentation for "My Dashboard" Project

## Overview

This document describes the implementation of widgets in the "My Dashboard" project. Currently, multiple widgets have been implemented including the Habits Tracking Widget, Clock Widget, Calendar Widget, and Counter Widget, which allow users to track their daily habits, view time and date, and maintain counters with history tracking.

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
  history: Array<{
    id: number;
    time: string;
  }>
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
      "history": []
    }
  ]
}
```

### Clock Widget

The Clock Widget displays the current time with customizable time zone and name.

#### Widget Features:

1. **Dashboard Display**:
   - Shows current time in HH:MM:SS format
   - Customizable time zone
   - Customizable name/display label
   - Supports 12/24 hour format

2. **Configuration Options**:
   - Time zone selection
   - Display name
   - 12/24 hour format selection
   - Custom styling options

#### Technical Implementation:

##### Implementation Files:
- `web/src/server/widgets/clock-widget.ts` - Main widget class and display template
- `web/src/server/widgets/clock-widget.utils.ts` - Client-side helper functions

##### Data Structure:
```typescript
interface ClockWidgetOptions {
  timeZone: string;
  name: string;
  format24Hour: boolean;
}
```

### Calendar Widget

The Calendar Widget displays the current date with customizable month and date.

#### Widget Features:

1. **Dashboard Display**:
   - Shows current date with day, month, and year
   - Customizable fixed month and date
   - Weekday display
   - Month name in full

2. **Configuration Options**:
   - Fixed month selection
   - Fixed date selection
   - Custom styling options

#### Technical Implementation:

##### Implementation Files:
- `web/src/server/widgets/calendar-widget.ts` - Main widget class and display template
- `web/src/server/widgets/calendar-widget.utils.ts` - Client-side helper functions

##### Data Structure:
```typescript
interface CalendarWidgetOptions {
  month: number;
  date: number;
  fixedDate: boolean;
}
```

### Currency Charts Widget

The Currency Charts Widget displays interactive financial charts for cryptocurrency and forex pairs using **real-time data from Yahoo Finance API** with Chart.js professional visualization.

#### Widget Features:

1. **Dual View System**:
   - **Dashboard Panel**: Shows configurable number of charts (default: 3)
   - **Modal View**: Displays all configured currency pairs in detail
   - Click maximize button to view all charts

2. **Multiple Currency Support**:
   - **Cryptocurrency**: BTC/USD, ETH/USD, BNB/USD, ADA/USD, SOL/USD, XRP/USD, DOT/USD, DOGE/USD, AVAX/USD, MATIC/USD
   - **Forex**: EUR/USD, GBP/USD, USD/JPY, USD/CAD, AUD/USD, USD/CHF, NZD/USD, USD/SGD
   - Custom display names for each pair

3. **Chart Features**:
   - Professional Chart.js implementation
   - Point styling with circular markers and white borders
   - Green/red color coding based on price movement
   - Interactive tooltips showing exact prices
   - Smooth curved lines (tension: 0.4)
   - Responsive design for all screen sizes

4. **Real-time Data Features**:
   - **Yahoo Finance API Integration**: Fetches live market data
   - **Automatic Symbol Conversion**: Converts BTC/USD → BTC-USD, EUR/USD → EURUSD=X
   - **30-second Updates**: Automatic periodic data refresh
   - **Smart Fallback**: Uses mock data when API is unavailable
   - **Error Handling**: Graceful degradation on API failures

5. **Configuration Options**:
   - Chart time periods: 1h, 4h, 1d, 1w, 1m
   - Dashboard charts limit (1-6 charts)
   - Volume bars toggle
   - Custom widget name
   - Individual pair display names

#### Technical Implementation:

##### Implementation Files:
- `web/src/server/widgets/currency-widget.ts` - Main widget class with Zod schemas and Chart.js integration
- `web/src/server/widgets/currency-widget.utils.ts` - Client-side utilities and window functions
- `web/src/server/services/yahoo-finance-api.ts` - Yahoo Finance API service for real-time data

##### Data Structure:
```typescript
interface CurrencyPair {
  symbol: string;
  name: string;
  displayName?: string;
}

interface CurrencyWidgetOptions {
  type: 'currency';
  name: string;
  currencyPairs: CurrencyPair[];
  chartPeriod: '1h' | '4h' | '1d' | '1w' | '1m';
  maxDashboardCharts: number;
}
```

##### Main Functions:
- `showCurrencyModal(modalId)` - Display detailed charts modal
- `hideCurrencyModal(modalId)` - Hide charts modal
- `updateCurrencyCharts(widgetId)` - Refresh chart data

#### System Integration:

The widget integrates with the general widget system and uses:
- Chart.js v4.5.1 for professional chart rendering
- Zod schemas for data validation
- Formly for widget configuration form
- Lucide Icons for UI elements
- Tailwind CSS for styling
- **Yahoo Finance API** for real-time market data
- **Rate limiting**: 50 requests per minute per user/session
- **Rate limiting implementation**: Uses sliding window algorithm with in-memory store
- **Identification priority**: Session ID → x-session-id header → IP address → 'unknown'
- **Error handling**: Returns TOO_MANY_REQUESTS TRPC error with retry information
- **Automatic cleanup**: Expired rate limit entries cleaned up every minute
- Periodic data updates (every 30 seconds)
- Smart fallback to mock data on API failures
- Point styling according to Chart.js official samples

#### Widget Configuration Example:

```json
{
  "type": "currency",
  "name": "Market Overview",
  "chartPeriod": "1d",
  "maxDashboardCharts": 3,
  "currencyPairs": [
    {
      "symbol": "BTC/USD",
      "name": "Bitcoin to US Dollar",
      "displayName": "Bitcoin Price"
    },
    {
      "symbol": "ETH/USD", 
      "name": "Ethereum to US Dollar",
      "displayName": "Ethereum Price"
    }
  ]
}
```



## Finance API

The Finance API provides real-time financial data through TRPC endpoints with built-in rate limiting protection.

### API Endpoints

#### `finance.getCurrencyData`
- **Purpose**: Fetch currency data for multiple symbols
- **Input**: Array of symbols, period, optional interval
- **Output**: Array of currency data with chart information
- **Rate Limited**: Yes (50 requests/minute)

#### `finance.getSingleCurrencyData`
- **Purpose**: Fetch data for a single currency pair
- **Input**: Symbol, period, optional interval
- **Output**: Detailed currency data for one pair
- **Rate Limited**: Yes (50 requests/minute)

### Rate Limiting Details

- **Algorithm**: Sliding window with 1-minute intervals
- **Limit**: 50 requests per minute per user/session
- **Identification**: Session ID → x-session-id header → IP address
- **Error Response**: `TOO_MANY_REQUESTS` with retry time information
- **Storage**: In-memory Map with automatic cleanup

### Implementation Files

- `web/src/server/trpc/routers/finance.ts` - Main finance router with rate limiting
- `web/src/server/services/yahoo-finance-api.ts` - Yahoo Finance data fetching service
- `web/src/server/middleware/rate-limit.ts` - Generic rate limiting utilities

### Error Handling

When rate limits are exceeded, clients receive:
```json
{
  "code": "TOO_MANY_REQUESTS",
  "message": "Rate limit exceeded. Maximum 50 requests per minute allowed. Try again in X seconds."
}
```

### Best Practices

1. Cache responses when possible to reduce API calls
2. Implement exponential backoff for retry logic
3. Monitor rate limit headers in responses
4. Handle rate limit errors gracefully in client applications

## Widgets Development Roadmap

### Near-term Tasks:
1. Improvement of widget configuration system
2. Adding ability to save widget states in the database
3. Implementation of widget change logging system

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