import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#D62828',
          redDark: '#A61E1E',
          black: '#111111',
          white: '#FFFFFF',
          cream: '#FAF7F2',
          gray: '#F2F0ED',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(17,17,17,0.08)',
        softLg: '0 20px 60px rgba(17,17,17,0.12)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flicker: {
          '0%,100%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.05) rotate(-2deg)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out both',
        flicker: 'flicker 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
