/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{html,js}","./views/*.ejs"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
