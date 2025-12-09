import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/preline/dist/*.js",
  ],
  theme: {
    extend: {
      animation: {
        "loading-bar": "loading-bar 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
