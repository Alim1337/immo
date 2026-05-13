/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#B8892A',
          light:   '#D4A84B',
          dim:     '#C9A86C',
        },
        lux: {
          bg:   '#FAF8F5',
          bg2:  '#F2EFE9',
          bg3:  '#EAE6DE',
          text: '#1A1713',
          muted:'#7A7265',
        },
      },
      fontFamily: {
        raleway:   ['Raleway', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}