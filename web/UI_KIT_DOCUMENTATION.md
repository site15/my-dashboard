# UI Kit Documentation

This document describes the UI components and styling guidelines for the dashboard application. All components follow a flat design aesthetic with long shadows and rounded corners.

## Design Principles

1. **Flat Design 2.0**: Using long shadows and clean lines for a modern look
2. **Consistent Spacing**: Using Tailwind's spacing scale for consistent margins and padding
3. **Rounded Corners**: All interactive elements have rounded corners (rounded-xl to rounded-2xl)
4. **Limited Color Palette**: Primary purple (#8A89F0) with grayscale for backgrounds and text

## Color Palette

| Color Name | Hex Value | Usage |
|------------|-----------|-------|
| Primary | #8A89F0 | Main buttons, links, accents |
| Secondary | #6d6cb5 | Hover states, secondary elements |
| Light Gray | gray-200 | Borders, light backgrounds |
| Dark Gray | gray-700 | Text, dark backgrounds |

## Typography

Using the Inter font family throughout the application:
- Headings: Bold weights (700)
- Subheadings: Semi-bold weights (600)
- Body text: Regular weights (400)

## Components

### Buttons

Multiple button styles are used throughout the application:

1. **Primary Gradient Button**: 
   - Used for main actions like signing in or creating dashboards
   - Features a gradient from #8A89F0 to #A2C0F5
   - Has long shadow effect with flat-btn-shadow class
   - Large padding (py-4) and rounded-2xl corners
   - Hover effect with scale transformation

2. **Secondary Text Buttons**: 
   - Used for alternative actions like "Continue as Guest"
   - Simple text styling with color transitions
   - No background or border

3. **Icon Buttons**: 
   - Circular buttons with icons
   - Light background with color transitions
   - Used for actions like opening modals

4. **Edit Buttons**: 
   - Subtle icon buttons that appear on hover
   - Semi-transparent backgrounds
   - Used for editing actions in dashboard widgets

5. **Add Widget Button**: 
   - Dashed border button for adding new items
   - Changes appearance on hover

All buttons have:
- Smooth hover transitions
- Appropriate sizing for their context
- Accessible color contrast

### Form Controls

All form controls follow a consistent flat design with rounded corners and subtle shadows.

#### Text Inputs (.flat-input)
- Full width with padding
- Rounded corners (rounded-xl)
- Light border (border-gray-200)
- Focus ring in primary color
- Subtle inset shadow

#### Checkboxes and Radio Buttons (.flat-checkbox)
- Square shape with rounded corners matching inputs (rounded-xl)
- Border color matches input borders (border-gray-200)
- Checked state uses primary color (#8A89F0)
- Custom checkmark using CSS pseudo-elements
- Consistent sizing (w-5 h-5)

#### Select Dropdowns
- Styled identically to text inputs using .flat-input class

#### Toggle Switches (.flat-switch)
- Custom styled toggle switches
- Smooth sliding animation
- Primary color for active state

### Other Components

#### Loading Spinner (.loading-spinner)
- Simple circular spinner using CSS animations
- Primary color for active arc

## Implementation Notes

1. All styles are defined in [styles.css](file:///home/endy/Projects/site15/my-dashboard/web/src/styles.css)
2. Components use Tailwind utility classes combined with custom CSS
3. Dark mode variants are provided for all components
4. All interactive elements have hover and focus states
5. Consistent spacing using Tailwind's spacing scale

## Usage Examples

To use these styles in your components:

```html
<!-- Primary Gradient Button -->
<button class="text-xl font-bold py-4 rounded-2xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide">
  Sign In
</button>

<!-- Primary Button with Icon -->
<button class="flex items-center justify-center text-xl font-bold py-4 rounded-2xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide">
  <i data-lucide="plus" class="w-5 h-5 mr-2"></i>
  Create New Dashboard
</button>

<!-- Secondary Text Button -->
<button class="text-pastel-blue font-semibold hover:text-pastel-blue/80 transition-colors">
  Login via Telegram
</button>

<!-- Icon Button -->
<button class="text-pastel-blue hover:text-pastel-blue/80 p-2 rounded-full transition-colors bg-pastel-blue/10 dark:bg-pastel-blue/30">
  <i data-lucide="calendar" class="w-6 h-6"></i>
</button>

<!-- Edit Button -->
<button class="text-gray-400 hover:text-pastel-blue p-2 rounded-full bg-white/70 backdrop-blur-sm dark:bg-[#1e1e1e]/70">
  <i data-lucide="pencil" class="w-5 h-5"></i>
</button>

<!-- Add Widget Button -->
<button class="text-gray-500 hover:text-pastel-blue font-bold flex items-center border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-pastel-blue/50 hover:bg-pastel-blue/5 dark:border-gray-700 dark:hover:bg-pastel-blue/10">
  <i data-lucide="plus" class="w-5 h-5 mr-2"></i>
  Add Widget
</button>

<!-- Text Input -->
<input type="text" class="flat-input" placeholder="Enter text">

<!-- Checkbox -->
<input type="checkbox" class="flat-checkbox">

<!-- Radio Button -->
<input type="radio" class="flat-checkbox">

<!-- Toggle Switch -->
<label class="flat-switch">
  <input type="checkbox">
  <span class="flat-switch-slider"></span>
</label>
```