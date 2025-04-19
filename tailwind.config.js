/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c06c04', // refined green for navbar
          light: '#4e7d4e',
        },
        surface: '#f1f5ec',     // light greenish background
        header: '#e8f0e4',      // header background
        accent: '#4a8758',      // for buttons, tags, etc.
      },
    }
  },
  plugins: [],
}
