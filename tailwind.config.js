/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#007AFF',
          dark: '#0A5EB0',
        },
        background: {
          light: '#F2F2F7',
          dark: '#000000',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1C1C1E',
        },
        surfaceSecondary: {
          light: '#F2F2F7',
          dark: '#2C2C2E',
        },
        text: {
          primary: {
            light: '#000000',
            dark: '#FFFFFF',
          },
          secondary: {
            light: '#3C3C43',
            dark: '#8E8E93',
          },
        },
        // Цвета для разных курсов
        course: {
          history: {
            light: '#007AFF',
            dark: '#0A5EB0',
          },
          mhk: {
            light: '#AF52DE',
            dark: '#8E3AB3',
          },
          literature: {
            light: '#52DE8E',
            dark: '#34C759',
          },
          social: {
            light: '#FF9500',
            dark: '#CC7A00',
          },
        },
        // Семантические цвета
        success: {
          light: '#34C759',
          dark: '#30D158',
        },
        warning: {
          light: '#FF9500',
          dark: '#CC7A00',
        },
        error: {
          light: '#FF3B30',
          dark: '#CC2E25',
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'card-light': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-dark': '0 1px 3px rgba(0, 0, 0, 0.3)',
        'card-hover-light': '0 8px 16px rgba(0, 0, 0, 0.12)',
        'card-hover-dark': '0 8px 16px rgba(0, 0, 0, 0.4)',
      },
      maxWidth: {
        'desktop': '1440px',
        'content': '1200px',
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
}

