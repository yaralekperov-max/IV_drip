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
        bg: "#0B1410",
        panel: "#13241D",
        // Золото
        gold: {
          DEFAULT: "#C9A86A",
          light: "#E3C78D",
        },
        // Текст
        ink: {
          DEFAULT: "#F2EFE8", // основной
          muted: "#A8B5AD", // приглушённый
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
    },
  },
  plugins: [],
};

export default config;
