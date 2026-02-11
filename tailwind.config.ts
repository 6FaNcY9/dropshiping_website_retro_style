import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        retro: {
          cyan: "#00ffff",
          magenta: "#ff00ff",
          yellow: "#ffff00",
          pink: "#ff6b9d",
          purple: "#9b59b6",
          orange: "#ff6b35",
          green: "#39ff14",
          blue: "#0066ff",
        },
        neon: {
          pink: "#ff1493",
          blue: "#00d4ff",
          green: "#00ff88",
          orange: "#ff8c00",
          purple: "#bf00ff",
        },
        dark: {
          900: "#0a0a0f",
          800: "#12121a",
          700: "#1a1a2e",
          600: "#252538",
          500: "#2d2d44",
        },
        cream: "#fef5e7",
        paper: "#f5f0e6",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        retro: ['"VT323"', "monospace"],
        display: ['"Orbitron"', "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor",
        "neon-sm": "0 0 5px currentColor, 0 0 10px currentColor",
        "neon-lg":
          "0 0 15px currentColor, 0 0 30px currentColor, 0 0 60px currentColor",
        retro: "4px 4px 0px #000",
        "retro-lg": "6px 6px 0px #000",
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
        flicker: "flicker 0.15s infinite",
        "glitch": "glitch 1s infinite",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.95" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
      },
      backgroundImage: {
        "grid-retro":
          "linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
