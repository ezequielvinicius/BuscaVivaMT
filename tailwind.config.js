/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Cores Polícia Civil MT (Institucionais)
        'police': {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af', // Azul principal
          900: '#1e3a8a'  // Azul escuro
        },
        // Cores complementares institucionais
        'institutional': {
          gold: '#fbbf24',      // Dourado MT
          'gold-dark': '#f59e0b',
          silver: '#e5e7eb',    // Prata
          'green': '#10b981',   // Verde status
          'green-dark': '#059669'
        }
      }
    },
  },
  plugins: [],
}
