import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9ddfd",
          300: "#7cc0fb",
          400: "#369ef7",
          500: "#0b80e7",
          600: "#0264c7",
          700: "#034fa1",
          800: "#074384",
          900: "#0c396e",
          950: "#082449",
        },
      },
    },
  },
  plugins: [],
};
export default config;
