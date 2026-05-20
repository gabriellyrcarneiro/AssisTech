/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef8ff',
          100: '#d9efff',
          500: '#1b7dd8',
          600: '#0f64b5',
          700: '#114f8d',
          900: '#102b46',
        },
        ink: '#17212b',
        muted: '#64748b',
        surface: '#f5f7fb',
      },
      boxShadow: {
        soft: '0 16px 45px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

