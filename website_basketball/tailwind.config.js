/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#FFFFFF',
        'brand-bg-secondary': '#F9FAFB', // gray-50
        'brand-text': '#1F2937', // gray-800
        'brand-text-secondary': '#6B7280', // gray-500
        'brand-accent': '#0EA5E9', // sky-500
        'brand-accent-hover': '#0284C7', // sky-600
      }
    },
  },
  plugins: [],
}
