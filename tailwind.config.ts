import type { Config } from "tailwindcss";
// @ts-expect-error - daisyui types not available
import daisyui from "daisyui";

const config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                secondary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
            },
            fontFamily: {
                sans: ['Spline Sans', 'sans-serif'],
            },
        },
    },
    plugins: [daisyui],
    daisyui: {
        themes: [
            {
                light: {
                    "primary": "#3b82f6",
                    "secondary": "#F43F5E",
                    "background": "#FAFAFA",
                    "surface": "#FFFFFF",
                    "textPrimary": "#111827",
                    "textSecondary": "#6B7280",
                    "border": "#E5E7EB",
                    "muted": "#F3F4F6",
                },
                dark: {
                    "primary": "#818CF8",
                    "secondary": "#FB7185",
                    "background": "#0F172A",
                    "surface": "#1E293B",
                    "textPrimary": "#F8FAFC",
                    "textSecondary": "#94A3B8",
                    "border": "#334155",
                    "muted": "#1E293B",
                },
            },
        ],
    },
};

export default config; 