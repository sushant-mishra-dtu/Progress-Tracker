/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: '#0f172a',
        charcoal: '#1e293b',
        charcoal_border: '#334155',
        charcoal_hover: '#475569',
        cyan: {
          DEFAULT: '#22d3ee',
          glow: 'rgba(34, 211, 238, 0.2)'
        },
        amber: '#f59e0b',
        indigo: '#6366f1'
      },
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
