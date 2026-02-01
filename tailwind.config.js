module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{astro,html,js,ts,tsx}',
    './public/**/*.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        accent: '#f59e42',
        reserved: '#fbbf24',
      },
      spacing: {
        'card': '1.25rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#222',
            a: { color: '#2563eb' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
