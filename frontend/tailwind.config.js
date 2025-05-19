/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        robotoCondensed: ['"Roboto Condensed"', 'sans-serif'],
        robotoSlab: ['"Roboto Slab"', 'serif'],
        roboto :['"Roboto"' ,'sans-serif']
      },
    },
  },
  plugins: [],
};
