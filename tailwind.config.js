/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        urgent: "#DC2626",
        primary: "#3B82F6",
        secondary: "#10B981",
        accent: "#F59E0B",
        dark: "#1F2937",
        light: "#F9FAFB",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },
      spacing: {
        "safe-area": "max(1rem, env(safe-area-inset-bottom))",
      },
      borderRadius: {
        xs: "0.25rem",
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        glow: "0 0 20px rgba(59, 130, 246, 0.3)",
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in",
        slideUp: "slideUp 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
      },
    },
  },
  plugins: [
    function ({ addComponents, theme }) {
      addComponents({
        ".btn": {
          "@apply px-4 py-2 rounded-lg font-semibold transition-all duration-250 cursor-pointer inline-flex items-center justify-center gap-2":
            {},
        },
        ".btn-primary": {
          "@apply bg-primary text-white hover:bg-blue-700 active:scale-95 shadow-md hover:shadow-lg":
            {},
        },
        ".btn-secondary": {
          "@apply bg-secondary text-white hover:bg-emerald-700 active:scale-95 shadow-md hover:shadow-lg":
            {},
        },
        ".btn-accent": {
          "@apply bg-accent text-white hover:bg-amber-600 active:scale-95 shadow-md hover:shadow-lg":
            {},
        },
        ".btn-danger": {
          "@apply bg-urgent text-white hover:bg-red-700 active:scale-95 shadow-md hover:shadow-lg":
            {},
        },
        ".btn-outline": {
          "@apply border-2 border-primary text-primary hover:bg-blue-50 active:scale-95":
            {},
        },
        ".btn-ghost": {
          "@apply text-dark hover:bg-gray-100 active:scale-95":
            {},
        },
        ".card": {
          "@apply bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-250 p-6":
            {},
        },
        ".card-compact": {
          "@apply bg-white rounded-lg shadow-sm p-4":
            {},
        },
        ".badge": {
          "@apply inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold":
            {},
        },
        ".badge-primary": {
          "@apply bg-blue-100 text-primary":
            {},
        },
        ".badge-secondary": {
          "@apply bg-emerald-100 text-secondary":
            {},
        },
        ".badge-danger": {
          "@apply bg-red-100 text-urgent":
            {},
        },
        ".badge-warning": {
          "@apply bg-amber-100 text-accent":
            {},
        },
        ".input": {
          "@apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-250":
            {},
        },
        ".input-lg": {
          "@apply px-4 py-3 text-lg":
            {},
        },
        ".label": {
          "@apply block text-sm font-semibold text-dark mb-2":
            {},
        },
      });
    },
  ],
};
