/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        unit: '4px',
        gutter: '16px',
        margin: '24px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '4px',
      }
    },
  },
  plugins: [],
}
