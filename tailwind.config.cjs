/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#7DD3FC',
          dark: '#38BDF8',
          light: '#E0F2FE',
        },
        silver: '#C0C0C0',
      },
    },
  },
  plugins: [],
};
