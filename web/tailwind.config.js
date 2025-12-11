/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: ['class', '[data-theme="dark"]'], // Use data-theme attribute for dark mode
  theme: {
    extend: {
      colors: {
        'pastel-blue': '#8a89f0',
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
    { pattern: /bg-\[#8a89f0\]/ },
    { pattern: /bg-\[#8A89F0\]/ },
    { pattern: /bg-\[#8a89f0\]\/\d+/ },
    { pattern: /bg-\[#8A89F0\]\/\d+/ },
    'bg-pastel-blue',
    'text-pastel-blue',
    'border-pastel-blue',
    'bg-pastel-blue/10',
    'bg-pastel-blue/20',
    'bg-pastel-blue/30',
    'bg-pastel-blue/50',
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