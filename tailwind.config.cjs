/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0b61c9',
          dark: '#084a99',
        },
        background: '#f3f5fb',
      },
      boxShadow: {
        navbar: '0 2px 4px rgba(15, 23, 42, 0.12)',
        card: '0 2px 6px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
