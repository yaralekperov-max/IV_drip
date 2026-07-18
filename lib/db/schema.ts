/**
 * Схема БД (Drizzle) — Managed PostgreSQL, Яндекс Облако (российский контур, 152-ФЗ).
 *
 * Разделение на два контура:
 *  - ОПЕРАЦИОННЫЙ (schema public): клиенты, адреса, визиты, платежи, персонал, OTP.
 *    Мастер операционки — amoCRM; здесь держим то, что нужно приложению, связка по client_id.
 *  - МЕДИЦИНСКИЙ (schema `medical`): справочник биомаркеров, загрузки анализов, результаты.
 *    Изолирован намеренно — с прицелом на возможный вынос на отдельный российский сервер.
 *    Поэтому медицинские таблицы НЕ имеют внешних ключей в операционный контур:
 *    связь с клиентом — по client_id на уровне приложения (а не FK в БД).
 */

import {
  pgSchema,
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  numeric,
  boolean,
  jsonb,
  timestamp,
  date,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Изолированная схема для медданных.
export const medical = pgSchema("medical");

// ─────────────────────────────── enums ───────────────────────────────

export const staffRole = pgEnum("staff_role", ["doctor", "operator", "admin"]);

export const visitStatus = pgEnum("visit_status", [
  "pending", // на подтверждении (желаемый слот)
  "confirmed", // оператор подтвердил
  "assigned", // бригада назначена
  "done", // выполнен
  "cancelled", // отменён
]);

export const paymentKind = pgEnum("payment_kind", ["payment", "refund"]);

export const analysisStatus = pgEnum("analysis_status", [
  "parsing", // распознаётся парсером
  "awaiting_review", // ждёт проверки врачом
  "approved", // подтверждён врачом → в динамике
  "rejected", // отклонён
]);

export const resultStatus = pgEnum("result_status", ["recognized", "edited", "approved"]);

// ─────────────────────────── операционный контур ───────────────────────────

export const clients = pgTable(
  "clients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    phone: text("phone").notNull(),
    name: text("name"),
    email: text("email"),
    /** ID контакта/сделки в amoCRM (мастер операционки). */
    amocrmId: text("amocrm_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("clients_phone_uq").on(t.phone)],
);

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  label: text("label"), // «Дом», «Офис»
  address: text("address").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const visits = pgTable(
  "visits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    program: text("program").notNull(),
    /** Желаемый слот (запись = слот с подтверждением оператора, не автобронь). */
    desiredDate: date("desired_date"),
    desiredTime: text("desired_time"),
    addressId: uuid("address_id").references(() => addresses.id),
    status: visitStatus("status").notNull().default("pending"),
    brigadeNote: text("brigade_note"),
    priceRub: integer("price_rub"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("visits_client_idx").on(t.clientId)],
);

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  visitId: uuid("visit_id").references(() => visits.id),
  amountRub: integer("amount_rub").notNull(),
  kind: paymentKind("kind").notNull().default("payment"),
  method: text("method"), // «картой ···· 4432», «бонусами»
  receiptNo: text("receipt_no"),
  /** ID платежа в ЮKassa. */
  yookassaId: text("yookassa_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Персонал (врач/оператор/админ). Для отдельного входа в админку (роли) — Этап 6+. */
export const staff = pgTable(
  "staff",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    phone: text("phone").notNull(),
    name: text("name").notNull(),
    role: staffRole("role").notNull().default("operator"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("staff_phone_uq").on(t.phone)],
);

/** Одноразовые коды входа по SMS (замена in-memory хранилища из Этапа 3). */
export const otpCodes = pgTable("otp_codes", {
  phone: text("phone").primaryKey(),
  codeHash: text("code_hash").notNull(),
  name: text("name"),
  attempts: integer("attempts").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─────────────────────────── медицинский контур (152-ФЗ) ───────────────────────────

/**
 * Справочник биомаркеров — «источник правды». Клиент загружает свой список позже;
 * структура гибкая, чтобы принять разные форматы (см. lib/modules/biomarkers/catalog).
 *
 * Нормы (referenceRanges) — JSONB-массив условий, чтобы поддержать зависимость от пола/возраста,
 * когда они станут известны. Простой случай (одна пара min/max) — тоже сюда.
 */
export const biomarkerCatalog = medical.table(
  "biomarker_catalog",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Стабильный машинный ключ, на него ссылаются результаты и динамика. */
    code: text("code").notNull(),
    name: text("name").notNull(),
    unit: text("unit"),
    category: text("category"),
    /** Синонимы названий из разных лабораторий (для сопоставления парсером). */
    aliases: jsonb("aliases").$type<string[]>().default([]),
    /**
     * Диапазоны нормы. Массив вида:
     * [{ sex?: "male"|"female"|null, ageMin?: number, ageMax?: number,
     *    min?: number, max?: number, text?: string }]
     */
    referenceRanges: jsonb("reference_ranges").$type<ReferenceRange[]>().default([]),
    sort: integer("sort").notNull().default(0),
    active: boolean("active").notNull().default(true),
    description: text("description"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("biomarker_code_uq").on(t.code)],
);

export type ReferenceRange = {
  sex?: "male" | "female" | null;
  ageMin?: number;
  ageMax?: number;
  min?: number;
  max?: number;
  text?: string;
};

/** Загрузка анализа клиентом (PDF в Object Storage). Гибридный флоу с проверкой врачом. */
export const analysisUploads = medical.table(
  "analysis_uploads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Связь с клиентом по ID (без FK — изоляция контура). */
    clientId: uuid("client_id").notNull(),
    /** Ключ объекта в Object Storage (см. lib/storage/medical-files). */
    fileKey: text("file_key").notNull(),
    lab: text("lab"),
    status: analysisStatus("status").notNull().default("parsing"),
    /** Согласие на обработку медданных (152-ФЗ) — момент подтверждения. */
    consentAt: timestamp("consent_at", { withTimezone: true }),
    /** ID сотрудника-проверяющего (по ID, без FK — изоляция). */
    reviewedBy: uuid("reviewed_by"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("uploads_client_idx").on(t.clientId)],
);

/** Распознанные/подтверждённые показатели одной загрузки. */
export const biomarkerResults = medical.table(
  "biomarker_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    uploadId: uuid("upload_id")
      .notNull()
      .references(() => analysisUploads.id, { onDelete: "cascade" }),
    /** Код из справочника (может быть null, если не сопоставлено). */
    catalogCode: text("catalog_code"),
    /** Как показатель назван в исходном PDF (для сверки врачом). */
    rawName: text("raw_name"),
    value: numeric("value"),
    unit: text("unit"),
    status: resultStatus("status").notNull().default("recognized"),
    takenAt: date("taken_at"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("results_upload_idx").on(t.uploadId)],
);
