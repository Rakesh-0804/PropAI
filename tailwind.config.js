/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030a14',
          900: '#08213a',
          700: '#0f3f66',
        },
        accent: {
          DEFAULT: '#5f86ff',
          dark: '#3557d6',
        },
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#5f86ff',
          600: '#3557d6',
          700: '#2644b8',
          800: '#1d3494',
          900: '#08213a',
        },
      },
    },
  },
  plugins: [],
};
