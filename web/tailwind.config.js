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
}