// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html", // Revisa que este archivo exista en la raíz
      "./src/**/*.{js,ts,jsx,tsx}", // Esto le dice que revise TODOS los archivos en la carpeta src
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }