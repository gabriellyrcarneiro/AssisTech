/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          900: '#431407',
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
