/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#665290",
          hover: "#9986d0",
          light: "#8e7cc3",
        },
        surface: "#f9f9fb",
      },
    },
  },
  plugins: [],
};