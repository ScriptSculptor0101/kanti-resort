/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // 60% Dominant Primary: Deep Slate Charcoal (#3d3d3d)
        charcoal: {
          DEFAULT: '#3d3d3d',
          dark: '#2b2b2b',
          darker: '#222222',
          surface: '#454545',
          surfaceLight: '#525252',
          card: 'rgba(69, 69, 69, 0.85)',
          border: 'rgba(216, 180, 160, 0.22)',
        },
        // 30% Secondary: Warm Cashmere Sand / Rose Beige (#d8b4a0)
        sand: {
          light: '#f0ded4',
          DEFAULT: '#d8b4a0',
          dark: '#c49a83',
          border: 'rgba(216, 180, 160, 0.25)',
        },
        // 10% Accent: Vivid Crimson Coral / Ruby Blush (#d1495b)
        ruby: {
          light: '#df6373',
          DEFAULT: '#d1495b',
          dark: '#b03545',
          glow: 'rgba(209, 73, 91, 0.4)',
        },
        resort: {
          dark: '#3d3d3d',
          darker: '#2b2b2b',
          surface: '#454545',
          surfaceLight: '#525252',
          card: 'rgba(69, 69, 69, 0.85)',
          gold: '#d1495b',
          goldLight: '#df6373',
          goldDark: '#b03545',
          sand: '#d8b4a0',
          sandLight: '#f0ded4',
          accent: '#d1495b',
          border: 'rgba(216, 180, 160, 0.25)',
        }
      },
      backgroundImage: {
        'himalayan-gradient': 'linear-gradient(180deg, rgba(26,12,5,0.4) 0%, rgba(26,12,5,0.88) 80%, rgba(26,12,5,1) 100%)',
        'blaze-shimmer': 'linear-gradient(135deg, #D53A04 0%, #F1551E 50%, #B02F02 100%)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.9' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
