/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class', // Активация темного режима через класс 'dark' на <html>
  theme: {
    extend: {
      colors: {
        'pastel-blue': '#8A89F0',
        'pastel-light': '#F4F7FB',
        'pastal-accent': '#A2C0F5',
        'pastel-pink': '#F5A2C0',
        'pastel-green': '#A2F5C0',
      }
    }
  },
  plugins: [],
}