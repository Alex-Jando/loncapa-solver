/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "rgb(var(--color-bg) / <alpha-value>)",
          card: "rgb(var(--color-card) / <alpha-value>)",
          border: "rgb(var(--color-border) / <alpha-value>)",
          primary: "rgb(var(--color-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-secondary) / <alpha-value>)",
          text: "rgb(var(--color-text) / <alpha-value>)",
          muted: "rgb(var(--color-muted) / <alpha-value>)",
          success: "rgb(var(--color-success) / <alpha-value>)",
          error: "rgb(var(--color-error) / <alpha-value>)",
          warning: "rgb(var(--color-warning) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};

