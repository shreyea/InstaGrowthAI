/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: "#0a0f2c",
        glass: "rgba(255, 255, 255, 0.05)",
        teal: {
          DEFAULT: "#14b8a6",
          dark: "#0d9488",
          glow: "#2dd4bf",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
};