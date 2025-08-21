/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cinema-dark': '#121212',
        'cinema-charcoal': '#1E1E1E',
        'cinema-light': '#E5E5E5',
        'cinema-gold': '#D4AF37',
        'cinema-copper': '#B87333',
        'cinema-muted': '#6B7280',
        'status-rated': '#059669',
        'status-pending': '#B45309',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
