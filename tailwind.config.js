/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ap: {
          black: "#0A0A0A",
          charcoal: "#1A1A1A",
          red: "#E4002B",
          redDark: "#B5001F",
          white: "#FFFFFF",
          gray: "#F2F2F2",
          grayLine: "#E5E5E5",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"], // ex: Anton, Bebas Neue, Archivo Black
        body: ["var(--font-body)", "sans-serif"], // ex: Inter, Manrope
      },
    },
  },
  plugins: [],
};
