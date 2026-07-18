import fs from "node:fs";
import path from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Подключение к БД — Managed Service for PostgreSQL (Яндекс Облако, российский контур).
 *
 * 152-ФЗ: все ПДн и медданные хранятся только в РФ. Соединение обязательно по TLS
 * (sslmode=verify-full) с CA-сертификатом Яндекса. Скачать сертификат:
 *   https://storage.yandexcloud.net/cloud-certs/CA.pem
 * и указать путь в DATABASE_CA_CERT_PATH.
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL не задан. Скопируй .env.example → .env.local и заполни доступы к Managed PostgreSQL.",
  );
}

function resolveSsl(): postgres.Options<Record<string, never>>["ssl"] {
  const caPath = process.env.DATABASE_CA_CERT_PATH;
  if (caPath) {
    const absolute = path.isAbsolute(caPath) ? caPath : path.join(process.cwd(), caPath);
    if (fs.existsSync(absolute)) {
      // Полная проверка цепочки TLS до сертификата Яндекса.
      return { ca: fs.readFileSync(absolute, "utf8"), rejectUnauthorized: true };
    }
    console.warn(`[db] CA-сертификат не найден по пути ${absolute}. Соединение без проверки цепочки.`);
  }
  // Разработка без CA — TLS требуется провайдером, но цепочку не проверяем.
  return "require";
}

// Переиспользуем клиента между hot-reload в dev, чтобы не плодить пулы соединений.
const globalForDb = globalThis as unknown as {
  sql?: ReturnType<typeof postgres>;
};

const sql =
  globalForDb.sql ??
  postgres(connectionString, {
    ssl: resolveSsl(),
    max: 10,
    idle_timeout: 20,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}

export const db = drizzle(sql, { schema });
export { schema };
