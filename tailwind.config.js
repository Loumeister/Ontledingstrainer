/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  // Restrict content globs to your source files to avoid scanning node_modules
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}