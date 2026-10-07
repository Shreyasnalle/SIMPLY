import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        simply: {
          dark: "#101010",
          surface: "#141414",
          coral: "#d97757",
          cream: "#e4e2dd",
          border: "#3e3e38",
          input: "#52514a",
          ring: "#d97757",
          card: "rgba(255, 255, 255, 0.015)",
        },
        border: "#3e3e38",
        input: "#52514a",
        ring: "#d97757",
        danger: {
          DEFAULT: "#f85149",
          light: "#ff6b6b",
        },
      },
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
