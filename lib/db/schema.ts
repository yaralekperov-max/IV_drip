/**
 * Схема БД (Drizzle) — Managed PostgreSQL, Яндекс Облако.
 *
 * ЗАГЛУШКА. Полное проектирование схемы — Этап 5 (клиенты, визиты, биомаркеры, платежи).
 *
 * Принцип 152-ФЗ: медданные (биомаркеры, PDF-метаданные, динамика) держим изолированно
 * — планируется в отдельной схеме PostgreSQL (напр. `medical`), операционные ссылки — по client_id.
 * Таблицы будут добавляться сюда по мере разработки модулей в lib/modules/*.
 */

// Пример структуры (закомментировано до Этапа 5):
//
// import { pgSchema, uuid, timestamp } from "drizzle-orm/pg-core";
// export const medical = pgSchema("medical");
// export const biomarkers = medical.table("biomarkers", { ... });

export {};
