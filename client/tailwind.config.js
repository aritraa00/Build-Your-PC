/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        shell: "#020617",
        panel: "#0f172a",
        accent: "#38bdf8",
        ember: "#f97316",
        success: "#22c55e"
      },
      boxShadow: {
        glow: "0 20px 45px rgba(14, 165, 233, 0.18)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 32%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
      },
      backgroundSize: {
        "hero-grid": "auto, 40px 40px, 40px 40px"
      }
    }
  },
  plugins: []
};

