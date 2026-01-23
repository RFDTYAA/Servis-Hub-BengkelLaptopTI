/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0a0a0a", // Background utama (Hampir hitam pekat)
          dark: "#171717", // Background sekunder (Card/Footer)
          accent: "#3b82f6", // Biru Electric (Tombol utama)
          cyan: "#06b6d4", // Aksen teks/gradient
          text: "#e5e5e5", // Teks putih sedikit abu (agar mata tidak sakit)
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
