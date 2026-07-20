import crypto from "node:crypto";

/**
 * Хранилище одноразовых кодов (OTP).
 *
 * ЗАГЛУШКА (in-memory): пригодна для dev/демо на одном инстансе. На Этапе 5
 * заменяется на хранилище в Managed PostgreSQL (или Redis) с TTL — иначе коды
 * не переживут перезапуск и не будут работать на нескольких инстансах.
 */

type OtpEntry = {
  codeHash: string;
  expiresAt: number;
  attempts: number;
  name?: string; // для регистрации
};

const TTL_MS = 5 * 60 * 1000; // 5 минут
const MAX_ATTEMPTS = 5;

// Переживаем hot-reload в dev.
const globalForOtp = globalThis as unknown as { otpStore?: Map<string, OtpEntry> };
const store = globalForOtp.otpStore ?? new Map<string, OtpEntry>();
if (process.env.NODE_ENV !== "production") globalForOtp.otpStore = store;

function hash(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

/** Генерирует 4-значный код, сохраняет его хэш для номера. Возвращает сам код (чтобы отправить в SMS). */
export function issueCode(phone: string, name?: string): string {
  const code = String(crypto.randomInt(1000, 10000));
  store.set(phone, { codeHash: hash(code), expiresAt: Date.now() + TTL_MS, attempts: 0, name });
  return code;
}

export type VerifyResult =
  | { ok: true; name?: string }
  | { ok: false; reason: "not_found" | "expired" | "too_many" | "mismatch" };

/** Проверяет код для номера. При успехе удаляет запись. */
export function verifyCode(phone: string, code: string): VerifyResult {
  const entry = store.get(phone);
  if (!entry) return { ok: false, reason: "not_found" };
  if (Date.now() > entry.expiresAt) {
    store.delete(phone);
    return { ok: false, reason: "expired" };
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(phone);
    return { ok: false, reason: "too_many" };
  }
  if (entry.codeHash !== hash(code)) {
    entry.attempts += 1;
    return { ok: false, reason: "mismatch" };
  }
  store.delete(phone);
  return { ok: true, name: entry.name };
}
