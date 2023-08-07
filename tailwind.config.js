/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{svelte,ts}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#55ffff",
        },
      },
    },
  },
  plugins: [],
};
