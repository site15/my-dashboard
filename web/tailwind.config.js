/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: ['class', '[data-theme="dark"]'], // Use data-theme attribute for dark mode
  theme: {
    extend: {
      colors: {
        'pastel-blue': {
          DEFAULT: '#8a89f0',
          10: '#8a89f01a',  // 10% opacity
          20: '#8a89f033',  // 20% opacity
          30: '#8a89f04d',  // 30% opacity
          50: '#8a89f080',  // 50% opacity
        },
        'pastel-light': '#f4f7fb',
        'pastel-accent': '#a2c0f5',
        'pastel-pink': '#f5a2c0',
        'pastel-green': '#a2f5c0',
      },
      spacing: {
        '4px': '4px',
      }
    }
  },
  plugins: [],
  safelist: [
    // Explicitly list all variations of pastel-blue classes that we use
    'bg-pastel-blue',
    'text-pastel-blue',
    'border-pastel-blue',
    'bg-pastel-blue/10',
    'bg-pastel-blue/20',
    'bg-pastel-blue/30',
    'bg-pastel-blue/50',
    'hover:bg-pastel-blue',
    'hover:text-pastel-blue',
    'hover:border-pastel-blue',
    'focus:bg-pastel-blue',
    'focus:text-pastel-blue',
    'focus:border-pastel-blue',
    
    // Also include the hex code variations
    { pattern: /bg-\[#8a89f0\]/ },
    { pattern: /text-\[#8a89f0\]/ },
    { pattern: /border-\[#8a89f0\]/ },
    { pattern: /bg-\[#8a89f0\]\/\d+/ },
    
    // Other pastel colors
    'text-pastel-green',
    'bg-pastel-green',
    'bg-pastel-green/10',
    'bg-pastel-green/20',
    'border-pastel-green',
    'text-pastel-pink',
    'bg-pastel-pink',
    'bg-pastel-pink/10',
    'bg-pastel-pink/20',
  ]
}