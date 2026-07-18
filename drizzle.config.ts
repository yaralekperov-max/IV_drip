import type { Config } from "drizzle-kit";

/**
 * Конфиг drizzle-kit (генерация миграций / studio).
 * БД — Managed PostgreSQL в Яндекс Облаке (российский контур, 152-ФЗ).
 */
export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
