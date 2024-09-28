/** @type {import('tailwindcss').Config} */
/*eslint-env node*/
const withMT = require("@material-tailwind/react/utils/withMT");
const { colors } = require('@mui/material');
 
module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'screen1200': '1200px',
        'screen1390': '1390px',
      },
      width: {
        '7300px': '7300px',
      },
      colors: {
        'primary': '#F58F20',
        'grey-20': '#D0D0D0',
        'yellow-10': '#F2C94C',
        'blue-10': '#034EA2',
        'blue-20': '#588ECA',
      }
    },
  },
  plugins: [],
});

