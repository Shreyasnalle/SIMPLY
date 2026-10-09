import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        simply: {
          dark: "#FAF9F5",
          surface: "#F5F4EF",
          coral: "#C96442",
          cream: "#3D3929",
          border: "#DAD9D4",
          input: "#B4B2A7",
          ring: "#C96442",
          card: "#F5F4EF",
          muted: "#EDE9DE",
          mutedForeground: "#6E6D68",
        },
        background: "#FAF9F5",
        foreground: "#3D3929",
        border: "#DAD9D4",
        input: "#B4B2A7",
        ring: "#C96442",
        primary: {
          DEFAULT: "#C96442",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E9E6DC",
          foreground: "#535146",
        },
        accent: {
          DEFAULT: "#E9E6DC",
          foreground: "#28261B",
        },
        card: {
          DEFAULT: "#F5F4EF",
          foreground: "#141413",
        },
        muted: {
          DEFAULT: "#EDE9DE",
          foreground: "#6E6D68",
        },
        chart: {
          1: "#B05730",
          2: "#9C87F5",
          3: "#DED8C4",
          4: "#DBD3F0",
          5: "#B4552D",
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
