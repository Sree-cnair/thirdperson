/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#191719', soft: '#292329' },
        cream: { DEFAULT: '#F1E9D8', deep: '#E6DCC9' },
        orange: { DEFAULT: '#D14F1F', deep: '#B23F14', soft: '#F6DCCF' },
        damson: { DEFAULT: '#4B203D', deep: '#35152B', light: '#693653' },
        blush: { DEFAULT: '#E8B9C6', soft: '#F4DCE2', deep: '#D995AA' },
        lemon: { DEFAULT: '#F2E77A', soft: '#F8F1B5', deep: '#E5D64F' },
        charcoal: { DEFAULT: '#252525', mid: '#5A5A5A', light: '#8C8C8C' },
        paper: '#FFFFFF',
        success: '#2F6B3B',
        warning: '#9A6A00',
        error: '#B42318',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        malayalam: ['"Noto Sans Malayalam"', 'sans-serif'],
      },
      letterSpacing: { label: '0.16em' },
      spacing: { 18: '4.5rem', 22: '5.5rem' },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-down': 'slide-down 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
