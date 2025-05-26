import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Nova paleta de cores baseada em #1a1a2e com destaque branco
        primary: {
          DEFAULT: "#1a1a2e",
          50: "#eaeaef",
          100: "#d5d5df",
          200: "#ababc0",
          300: "#8282a0",
          400: "#585880",
          500: "#2f2f61",
          600: "#1a1a2e",
          700: "#151526",
          800: "#10101d",
          900: "#0a0a14",
          950: "#05050a",
        },
        accent: {
          DEFAULT: "#ffffff",
          50: "#ffffff",
          100: "#f7f7f7",
          200: "#e6e6e6",
          300: "#d4d4d4",
          400: "#c2c2c2",
          500: "#a0a0a0",
          600: "#7e7e7e",
          700: "#5c5c5c",
          800: "#3a3a3a",
          900: "#181818",
          950: "#0d0d0d",
        },
        secondary: {
          DEFAULT: "#16213e",
          50: "#e9eaf0",
          100: "#d3d5e1",
          200: "#a7abc3",
          300: "#7b81a5",
          400: "#4f5787",
          500: "#2e3359",
          600: "#16213e",
          700: "#121a32",
          800: "#0d1425",
          900: "#090d19",
          950: "#04060c",
        },
        background: {
          DEFAULT: "#f5f5f7",
          dark: "#0f0f1a",
        },
        border: "hsl(var(--border))",
        "border-white-dark": "rgba(255, 255, 255, 0.2)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
