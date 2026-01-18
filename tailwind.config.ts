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
                primary: {
                    DEFAULT: "#22C55E",
                    dark: "#16A34A",
                    light: "#4ADE80",
                    50: "#F0FDF4",
                    100: "#DCFCE7",
                    200: "#BBF7D0",
                    300: "#86EFAC",
                    400: "#4ADE80",
                    500: "#22C55E",
                    600: "#16A34A",
                    700: "#15803D",
                    800: "#166534",
                    900: "#14532D",
                },
                accent: {
                    DEFAULT: "#F97316",
                    dark: "#EA580C",
                    light: "#FB923C",
                },
                surface: {
                    DEFAULT: "#FFFFFF",
                    secondary: "#F8FAFC",
                },
                text: {
                    DEFAULT: "#1F2937",
                    muted: "#6B7280",
                    light: "#9CA3AF",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                display: ["var(--font-outfit)", "system-ui", "sans-serif"],
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out forwards",
                "slide-up": "slideUp 0.5s ease-out forwards",
                "slide-in-right": "slideInRight 0.5s ease-out forwards",
                "scale-in": "scaleIn 0.3s ease-out forwards",
                "float": "float 3s ease-in-out infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideInRight: {
                    "0%": { opacity: "0", transform: "translateX(-20px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                scaleIn: {
                    "0%": { opacity: "0", transform: "scale(0.95)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
            boxShadow: {
                "soft": "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
                "card": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
                "card-hover": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            },
        },
    },
    plugins: [],
};

export default config;
