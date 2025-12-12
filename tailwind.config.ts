import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e6e8ff',
          200: '#c5c9ff',
          300: '#9ca3ff',
          400: '#7c82ff',
          500: '#595fff',
          600: '#4243e6',
          700: '#3333b4',
          800: '#232480',
          900: '#14164d'
        }
      }
    }
  },
  plugins: []
};

export default config;
