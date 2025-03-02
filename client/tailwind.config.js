/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 15s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }, // Adjusted to scroll completely
        },
      },
    height: {
      'safe-area': 'env(safe-area-inset-bottom, 0px)'
    }
    },
  },
  plugins: [],
}

