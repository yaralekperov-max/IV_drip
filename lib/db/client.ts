import fs from "node:fs";
import path from "node:path";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Подключение к БД — Managed Service for PostgreSQL (Яндекс Облако, российский контур).
 *
 * 152-ФЗ: все ПДн и медданные хранятся только в РФ. Соединение обязательно по TLS
 * (sslmode=verify-full) с CA-сертификатом Яндекса:
 *   https://storage.yandexcloud.net/cloud-certs/CA.pem
 * путь к нему — в DATABASE_CA_CERT_PATH.
 *
 * Инициализация ЛЕНИВАЯ: подключение и проверка DATABASE_URL происходят при первом
 * обращении к `db`, а не при импорте модуля. Это позволяет собирать приложение
 * (next build) и импортировать роуты без заданного DATABASE_URL.
 */

function resolveSsl(): postgres.Options<Record<string, never>>["ssl"] {
  const caPath = process.env.DATABASE_CA_CERT_PATH;
  if (caPath) {
    const absolute = path.isAbsolute(caPath) ? caPath : path.join(process.cwd(), caPath);
    if (fs.existsSync(absolute)) {
      return { ca: fs.readFileSync(absolute, "utf8"), rejectUnauthorized: true };
    }
    console.warn(`[db] CA-сертификат не найден по пути ${absolute}. Соединение без проверки цепочки.`);
  }
  return "require";
}

const globalForDb = globalThis as unknown as {
  sql?: ReturnType<typeof postgres>;
  db?: PostgresJsDatabase<typeof schema>;
};

function createDb(): PostgresJsDatabase<typeof schema> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL не задан. Скопируйте .env.example → .env.local и заполните доступы к Managed PostgreSQL.",
    );
  }
  const sql =
    globalForDb.sql ??
    postgres(connectionString, { ssl: resolveSsl(), max: 10, idle_timeout: 20 });
  if (process.env.NODE_ENV !== "production") globalForDb.sql = sql;
  return drizzle(sql, { schema });
}

function getDb(): PostgresJsDatabase<typeof schema> {
  if (!globalForDb.db) globalForDb.db = createDb();
  return globalForDb.db;
}

/** Ленивый прокси: реальное подключение создаётся при первом обращении. */
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(_target, prop) {
    const real = getDb() as unknown as Record<string | symbol, unknown>;
    const value = real[prop];
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
