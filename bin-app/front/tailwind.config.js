/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blink: 'blink 1s infinite',
      },
      keyframes: {
        blink: {
          '0%': { opacity: 1 },
          '50%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary': '#479e96',
        'secondary': '#C1EAE5',
        'wobzBlue':'#74BDB6',
        'wobzPink':'#EC6D64'

      },
    },
  },
  plugins: [],
}