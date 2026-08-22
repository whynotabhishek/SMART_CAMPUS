import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cork': '#D4A574',
        'pin-red': '#E63946',
        'found-green': '#2D6A4F',
        'thumbtack-blue': '#457B9D',
        'paper-white': '#FAFAF5',
        'ink-dark': '#1D1D1D',
      },
      fontFamily: {
        display: ['var(--font-display)', 'cursive'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fillBar: {
          '0%': { width: '0' },
          '100%': { width: 'var(--target-width)' },
        }
      },
      animation: {
        'slideInLeft': 'slideInLeft 0.6s ease-out forwards',
        'fadeIn': 'fadeIn 0.4s ease-out forwards',
        'fillBar': 'fillBar 0.6s ease-out forwards',
      }
    },
  },
  plugins: [],
}
export default config
