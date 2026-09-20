import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        simply: {
          dark: "#0d1f1c",
          coral: "#fb8569",
          cream: "#e4e2dd",
          border: "rgba(251, 133, 105, 0.2)",
          card: "rgba(255, 255, 255, 0.015)",
        },
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
