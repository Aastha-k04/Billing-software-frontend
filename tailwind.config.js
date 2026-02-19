/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          obsidian: '#050505',
          amber: {
            700: '#B45309',
            900: '#78350F',
          },
          alabaster: '#E2E8F0', // slate-200
          taupe: '#71717A',     // zinc-500
        }
      }
    },
  },
  plugins: [],
}