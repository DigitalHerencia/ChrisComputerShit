import type { Config } from 'tailwindcss';
import tailwindAnimate from 'tailwindcss-animate';

export default {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}', './public/index.html'],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [tailwindAnimate],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
    './src/globals.css',
  ],
} as Config;
