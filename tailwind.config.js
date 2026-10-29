/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          cyan: '#00F0FF',
          blue: '#2563EB',
          violet: '#8B5CF6',
        },
        obsidian: {
          950: '#04070F',
          900: '#070C18',
          850: '#0B1224',
          800: '#101932',
          700: '#172344',
          600: '#26386B',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 35px -5px rgba(0, 240, 255, 0.45)',
        'glow-blue': '0 0 35px -5px rgba(37, 99, 235, 0.45)',
        'glow-orb': '0 0 50px 10px rgba(0, 240, 255, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.5)',
        'glow-subtle': '0 0 20px -3px rgba(34, 211, 238, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
