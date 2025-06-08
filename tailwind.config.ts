/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // toggle by adding .dark on <html> or <body>
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      colors: {
        primary: "var(--color-primary)",
        "primary-foreground": "var(--color-primary-foreground)",
        secondary: "var(--color-secondary)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        "border-active": "var(--color-border-active)",
        "border-success": "var(--color-border-success)",
        "border-error": "var(--color-border-error)",
        "text-low": "var(--color-text-low)",
        "text-high": "var(--color-text-high)",
      },
      boxShadow: {
        card: "0 2px 8px 0 rgb(0 0 0 / 0.08)",
      },
    },
  },
  plugins: [],
};