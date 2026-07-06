/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // Prefijo para aislar utilidades CSS y evitar colisiones con otros microfrontends
  prefix: '{{CSS_PREFIX}}-',
  // Aumenta especificidad solo dentro del contenedor del microfrontend
  important: '.{{SCOPE_CLASS}}',
  theme: {
    extend: {
      colors: {
        // FBC Corporate Blues - Primary palette for headers, primary buttons, and links
        'fbc-blue': {
          10: '#05111b',
          9: '#071724',
          8: '#091d2e',
          7: '#0b253b',
          6: '#0c2941', // Main secondary color
          5: '#3d5467',
          4: '#5c7080',
          3: '#8f9da8',
          2: '#b4bdc4',
          1: '#e7eaec',
        },
        // FBC Ice Blues - Secondary palette for complementary elements and backgrounds
        'fbc-ice': {
          10: '#054159',
          9: '#075574',
          8: '#096e96',
          7: '#0c8dc0',
          6: '#0d9bd3', // Main primary color
          5: '#3dafdc',
          4: '#5dbce2',
          3: '#90d1eb',
          2: '#b4e0f1',
          1: '#e7f5fb',
        },
        // Legacy UI Kit Colors - Maintained for backward compatibility
        'primary': {
          50: '#e7f5fb',
          100: '#b4e0f1',
          200: '#90d1eb',
          300: '#5dbce2',
          400: '#3dafdc',
          500: '#0d9bd3',
          600: '#0c8dc0',
          700: '#096e96',
          800: '#075574',
          900: '#054159',
        },
        'secondary': {
          50: '#e7eaec',
          100: '#b4bdc4',
          200: '#8f9da8',
          300: '#5c7080',
          400: '#3d5467',
          500: '#0c2941',
          600: '#0b253b',
          700: '#091d2e',
          800: '#071724',
          900: '#05111b',
        },
        // Corporate Neutral Colors - For backgrounds, text, and borders
        'neutral': {
          1: '#f9f9f9', // Light backgrounds
          2: '#f1f1f1',
          3: '#dddddd',
          4: '#c2c2c2',
          5: '#a6a6a6',
          6: '#8b8b8b',
          7: '#717171',
          8: '#505050',
          9: '#404040',
          10: '#333333', // Dark text
        },
        // FBC Status Colors - Alert, success, warning, and info states
        'alert': {
          primary: '#f7cac8', // Light error background
          secondary: '#721c24', // Dark error text
        },
        'success': {
          primary: '#d7f0d9', // Light success background
          secondary: '#186f07', // Dark success text
        },
        'warning': {
          primary: '#fcf5cb', // Light warning background
          secondary: '#856404', // Dark warning text
        },
        'info': {
          primary: '#b4e0f1', // Light info background
          secondary: '#075574', // Dark info text
        },
        // UI Kit Accent Colors - Additional corporate colors
        'accent': {
          500: '#0072CE',
          600: '#005ea3',
          700: '#004a87',
        },
        // Extended Status Colors - For enhanced UI feedback
        'error': {
          50: '#ffebee',
          500: '#f44336',
          600: '#d32f2f',
          700: '#b71c1c',
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'pulse-opacity': 'pulse-opacity 1.5s infinite',
        'fade-in': 'fade-in 0.2s ease-out forwards',
        'zoom-in': 'zoom-in 0.2s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.3s ease-out forwards',
      },
      keyframes: {
        'pulse-opacity': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'zoom-in': {
          from: {
            transform: 'scale(0.95)',
            opacity: '0'
          },
          to: {
            transform: 'scale(1)',
            opacity: '1'
          },
        },
        'fade-in-down': {
          from: {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable CSS reset to avoid conflicts with portal styles
  },
};
