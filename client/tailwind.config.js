/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A0C10',
          card: '#12151C',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#E63946',
          gold: '#E0A96D',
          cream: '#F4EAE0',
          textMuted: '#9CA3AF'
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
