/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981',
        secondary: '#3B82F6',
        accent: '#F59E0B',
        danger: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
      }
    },
  },
  plugins: [],
}