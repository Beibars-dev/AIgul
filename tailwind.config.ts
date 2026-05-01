import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: "#2a1f2d",
        background: "#fdfaf6",
        cream: {
          50: "#fdfaf6",
          100: "#faf3ea",
          200: "#f3e3cc",
        },
        rose: {
          custom: "#d4889a",
          deep: "#a8546c",
        },
        sage: {
          50: "#f3f6f1",
          200: "#c8d6bf",
          400: "#8aa37a",
          600: "#5b7a4d",
          800: "#3a5230",
        },
        accent: {
          gold: "#c4a572",
          blush: "#f9d4d4",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-up": "fadeUp 0.7s ease-out",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "petal-gradient":
          "linear-gradient(135deg, #fdfaf6 0%, #f9d4d4 50%, #f3e3cc 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
