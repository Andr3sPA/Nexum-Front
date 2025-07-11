import type { Config } from "tailwindcss"

const config: Config = {
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
        // Paleta de color principal - Universidad de Antioquia
        primary: {
          50: '#e6f7ed',
          100: '#ccefd9',
          200: '#99dfb3',
          300: '#66cf8d',
          400: '#33bf67',
          500: '#026937', // Principal
          600: '#35944b',
          700: '#43b649',
          800: '#8dc63f',
          900: '#3ebdac',
          950: '#069a7e',
          1000: '#0e7774',
          DEFAULT: '#026937',
        },
        // Paleta de color complementaria
        complementary: {
          purple: '#70205b',
          blue: '#137598',
          red: '#ef434d',
          orange: '#f9a12c',
        },
        // Colores de estado
        state: {
          success: '#43b649',
          warning: '#f9a12c',
          error: '#ef434d',
          info: '#137598',
        },
        // Colores neutros
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Colores de fondo
        background: {
          primary: '#ffffff',
          secondary: '#f9fafb',
          tertiary: '#f3f4f6',
        },
        // Colores de texto
        text: {
          primary: '#111827',
          secondary: '#4b5563',
          tertiary: '#6b7280',
          inverse: '#ffffff',
        },
        // Colores de borde
        border: {
          light: '#e5e7eb',
          medium: '#d1d5db',
          dark: '#9ca3af',
        },
        // Colores legacy para compatibilidad
        secondary: {
          DEFAULT: '#70205b',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: '#ef434d',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: '#f9a12c',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: '#43b649',
        warning: '#f9a12c',
        info: '#137598',
        highlight: '#137598',
        "lime-dark": '#6c9a06',
      },
      fontFamily: {
        // Tipografías institucionales
        primary: ['DIN-BlackAlternate', 'system-ui', 'sans-serif'],
        secondary: ['Roboto', 'system-ui', 'sans-serif'],
        tertiary: ['Roboto Slab', 'serif'],
        accent: ['Renogare', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "zoom-in": {
          from: { transform: "scale(0.95)" },
          to: { transform: "scale(1)" },
        },
        "zoom-out": {
          from: { transform: "scale(1)" },
          to: { transform: "scale(0.95)" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "zoom-in": "zoom-in 0.2s ease-out",
        "zoom-out": "zoom-out 0.2s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.2s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.2s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.2s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
