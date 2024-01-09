/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./docs/**/*.html"],
  theme: {
    extend: {
      colors: {
        "font-black": "#222222",
        "font-white": "#dadada",
        "font-gray": "#a2aab3",
        "font-quote": "#3eb4c0",
        bold: "#ff82b2",
        link: "#79a9ed",
        "link-hover": "#adc9f2",
        "background-dark": "#1c2127",
      },
    },
  },
  plugins: [],
};
