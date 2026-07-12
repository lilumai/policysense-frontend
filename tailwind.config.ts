import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'IBM Plex Sans Thai'", "'Noto Sans Thai'", "sans-serif"],
      },
      screens: {
        // matches source: @media(max-width:820px) collapses login-left
        loginmd: { max: "820px" },
        loginlg: { min: "821px" },
      },
    },
  },
  plugins: [],
};

export default config;
