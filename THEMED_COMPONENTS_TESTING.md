# Testing Themed Components

This document explains how to test the newly implemented themed color and icon select components.

## Test Page

A test page has been created at `/theme-components-test` that demonstrates both components in action.

## How to Test

1. Navigate to `/theme-components-test` in your browser
2. Observe the components in light mode
3. Click the theme toggle button in the navigation sidebar to switch to dark mode
4. Observe how the components adapt to the dark theme

## What to Look For

### Color Select Component
- In light mode: White background with light borders
- In dark mode: Dark background (#1e1e1e) with darker borders (#374151)
- Hover states should also adapt to the theme
- Selected items should have appropriate background colors for each theme

### Icon Select Component
- In light mode: White background with light borders
- In dark mode: Dark background (#1e1e1e) with darker borders (#374151)
- Hover states should adapt to the theme
- Selected items should have appropriate background colors for each theme
- Dropdown should have proper shadows that work in both themes

## Expected Behavior

Both components should seamlessly adapt to theme changes without requiring a page refresh. The styling should be consistent with the rest of the application's theme.