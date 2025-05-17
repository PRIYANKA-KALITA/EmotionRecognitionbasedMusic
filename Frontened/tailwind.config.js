// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

// tailwind.config.js
module.exports = {
  darkMode: 'class', // Change: Enable dark mode using a CSS class
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1B1B1B",       // Default dark mode background
        backgroundLight: "#F3F4F6",    // Light mode background (example)
        primary: "#FFFFFF",          // Primary text color
        primaryDark: "#1F2937",      // Primary text color for light mode, if needed
        accent: "#F97316",           // Accent color
        'accent-hover': "#EA580C",   // Accent color for hover state
        secondary: "#9CA3AF",        // Secondary text color
      },
    },
  },
  plugins: [],
}
