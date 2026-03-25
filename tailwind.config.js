/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#0a0f1e',
        surface: '#1e293b',
        card:    '#162032',
        accent:  '#22c55e',
        muted:   '#94a3b8',
        border:  '#1e2d42',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        sans:   ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
