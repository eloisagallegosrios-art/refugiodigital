import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream:  { DEFAULT: '#FAF7F0', 2: '#F5EDE0', 3: '#EDE3CF' },
        sand:   { DEFAULT: '#D9C9A8', dark: '#B8A07A' },
        gold:   { DEFAULT: '#C9A84C', light: '#E8D48A', dark: '#8C6D1F' },
        sage:   { DEFAULT: '#7A9E7E', light: '#A8C5AC', dark: '#4A6E4E' },
        stone:  {
          50: '#F8F6F2', 100: '#EEEAE2', 200: '#D5CFC4',
          300: '#B5ADA0', 400: '#8C8478', 500: '#635C52',
          600: '#46403A', 700: '#2E2A25', 800: '#1A1714',
        },
        warm:   { white: '#FDFAF5' },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(3rem,8vw,6rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'hero':    ['clamp(2rem,5vw,3.75rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'title':   ['clamp(1.5rem,3vw,2.25rem)', { lineHeight: '1.2' }],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up':   'fadeUp 0.9s ease-out forwards',
        'fade-in':   'fadeIn 1.2s ease-out forwards',
        'drift':     'drift 8s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeUp:  { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        drift:   { from: { transform: 'translateY(0px)' }, to: { transform: 'translateY(-12px)' } },
      },
      transitionDuration: { '400': '400ms', '600': '600ms', '800': '800ms' },
    },
  },
  plugins: [],
}

export default config
