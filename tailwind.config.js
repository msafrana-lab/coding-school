/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        space: {
          950: '#060A22',
          900: '#0B1035',
          800: '#141B4D',
          700: '#1E2765',
          600: '#2B357F',
          500: '#3A4699',
        },
        nebula: {
          300: '#C4B0FF',
          400: '#A88BFF',
          500: '#8B63F7',
          600: '#7248E0',
          700: '#5B36BE',
        },
        comet: {
          300: '#7DEFFB',
          400: '#3EDDF2',
          500: '#17C3DE',
          600: '#0FA0BE',
        },
        star: {
          300: '#FFE58A',
          400: '#FFD23F',
          500: '#F7B910',
          600: '#D99A06',
        },
        coral: {
          400: '#FF8A9B',
          500: '#FF6B81',
          600: '#E84965',
        },
        mint: {
          400: '#5CE8A4',
          500: '#34D186',
          600: '#1FAF6B',
        },
      },
      boxShadow: {
        glow: '0 0 24px rgba(139, 99, 247, 0.45)',
        'glow-cyan': '0 0 24px rgba(23, 195, 222, 0.4)',
        card: '0 8px 24px rgba(3, 6, 28, 0.45)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.25' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '80%': { transform: 'scale(1.06)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'bounce-x': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-8px)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        'pop-in': 'pop-in 0.35s ease-out both',
        wiggle: 'wiggle 0.5s ease-in-out',
        'slide-up': 'slide-up 0.4s ease-out both',
        'bounce-x': 'bounce-x 0.9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
