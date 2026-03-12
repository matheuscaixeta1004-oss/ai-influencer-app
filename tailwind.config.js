/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#00AFF0', dark: '#0099D4', light: '#E6F7FE' },
        sidebar: { DEFAULT: '#1A1A2E', active: '#243050' },
        border: '#E0E0E0',
        'text-primary': '#000000',
        'text-secondary': '#757575',
        'credit-gold': '#FFD700',
      },
      fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
      boxShadow: {
        card: '0 1px 8px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
}
