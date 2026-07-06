/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  prefix: 'maint-',
  important: '.{{SCOPE_CLASS}}',
  theme: {
    extend: {
      colors: {
        'neutral': {
          1: '#f9f9f9',
          2: '#f1f1f1',
          3: '#dddddd',
          4: '#c2c2c2',
          5: '#a6a6a6',
          6: '#8b8b8b',
          7: '#717171',
          8: '#505050',
          9: '#404040',
          10: '#333333',
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
