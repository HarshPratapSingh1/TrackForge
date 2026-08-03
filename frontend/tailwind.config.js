module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cloud: "#f7fbff",
        sky: { 50: "#f0f9ff", 100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc", 400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1", 900: "#0c4a6e" },
        coral: { 300: "#fda4af", 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48" },
        ink: { 500: "#5b7184", 700: "#33485c", 900: "#0f2030" },
      },
      fontFamily: { nunito: ["Nunito", "sans-serif"] },
      borderRadius: { "4xl": "2rem", "5xl": "2.75rem" },
      boxShadow: {
        soft: "0 24px 60px -22px rgba(56,189,248,0.45)",
        card: "0 40px 90px -30px rgba(15,32,48,0.30)",
      },
    }
  },
  plugins: []
};