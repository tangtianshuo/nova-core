/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#818cf8',
          secondary: '#a5b4fc',
          accent: '#34d399',
          glow: '#6366f1',
        },
      },
    },
  },
  plugins: [],
}
