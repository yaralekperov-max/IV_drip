import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Сессия клиента ЛК — подписанная httpOnly-кука (HMAC-SHA256).
 * Без внешних зависимостей. Секрет — AUTH_SESSION_SECRET.
 *
 * Примечание: полноценное хранилище пользователей появится на Этапе 5 (Managed PostgreSQL).
 * Сейчас в сессии держим телефон и имя — достаточно для навигации по ЛК на моках.
 */

export const SESSION_COOKIE = "vena_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 дней

export type SessionData = {
  phone: string;
  name?: string;
  /** issued at (unix, сек) */
  iat: number;
};

function secret(): string {
  const s = process.env.AUTH_SESSION_SECRET;
  if (!s) {
    if (process.env.NODE_ENV === "production") {
      // Не роняем процесс, но громко предупреждаем: в проде секрет обязателен.
      console.error(
        "[auth] ВНИМАНИЕ: AUTH_SESSION_SECRET не задан в production — используется небезопасное значение по умолчанию. Задайте секрет!",
      );
    }
    return "dev-insecure-secret-change-me";
  }
  return s;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Кодирует и подписывает сессию в строку `payload.signature`. */
export function encodeSession(data: SessionData): string {
  const payload = base64url(JSON.stringify(data));
  return `${payload}.${sign(payload)}`;
}

/** Проверяет подпись и возвращает данные сессии, либо null. */
export function decodeSession(token: string | undefined): SessionData | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  // Постоянное по времени сравнение.
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionData;
  } catch {
    return null;
  }
}

/** Устанавливает cookie сессии (серверный контекст). */
export async function setSession(data: SessionData): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, encodeSession(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

/** Читает текущую сессию из cookie. */
export async function getSession(): Promise<SessionData | null> {
  const jar = await cookies();
  return decodeSession(jar.get(SESSION_COOKIE)?.value);
}

/** Удаляет cookie сессии. */
export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
