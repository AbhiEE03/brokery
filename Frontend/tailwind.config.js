/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // 🔥 THIS IS REQUIRED
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0D10",
        panel: "#111418",
        card: "#141820",
        border: "#1F2430",
        muted: "#9CA3AF",
      },
    },
  },
  plugins: [],
};

