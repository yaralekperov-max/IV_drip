import type { Config } from "tailwindcss";

/**
 * Дизайн-система VENA (источник правды — prototypes/).
 * Тёмная премиум-тема: глубокий зелёный фон + золото, шрифты Fraunces (заголовки/цифры) и Inter (текст).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Фон и панели
        bg: {
          DEFAULT: "#0B1410",
          2: "#0F1B16",
        },
        panel: {
          DEFAULT: "#13241D",
          2: "#172E25",
        },
        // Золото
        gold: {
          DEFAULT: "#C9A86A",
          light: "#E3C78D",
        },
        // Текст
        ink: {
          DEFAULT: "#F2EFE8", // основной
          muted: "#A8B5AD", // приглушённый
          dim: "#6E7C73", // самый тусклый
        },
        // Линии/границы
        line: {
          DEFAULT: "rgba(201,168,106,0.18)",
          soft: "rgba(242,239,232,0.08)",
        },
        // Статусные цвета (визиты, анализы)
        status: {
          pos: "#7FB88A",
          neg: "#C97A6A",
          warn: "#D9B470",
          info: "#7AA8C9",
        },
      },
      fontFamily: {
        // Заголовки и цифры
        display: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        // Основной текст
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        // Мягкие премиум-тени
        soft: "0 10px 40px -12px rgba(0, 0, 0, 0.5)",
        gold: "0 8px 30px -10px rgba(201, 168, 106, 0.35)",
      },
      keyframes: {
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
        dripfall: {
          "0%": { transform: "translateY(0) scaleY(.6)", opacity: "0" },
          "12%": { transform: "translateY(0) scaleY(1)", opacity: "1" },
          "80%": { transform: "translateY(30px) scaleY(1.1)", opacity: "1" },
          "100%": { transform: "translateY(36px) scaleY(1.4)", opacity: "0" },
        },
        fluidslosh: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(2px)" },
        },
        hubpulse: {
          "0%,100%": { opacity: "0.4" },
          "50%": { opacity: "0.85" },
        },
        fadein: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        dripfall: "dripfall 1.9s cubic-bezier(.55,0,.9,1) infinite",
        fluidslosh: "fluidslosh 5s ease-in-out infinite",
        hubpulse: "hubpulse 4.5s ease-in-out infinite",
        fadein: "fadein 0.4s ease",
      },
    },
  },
  plugins: [],
};

export default config;
