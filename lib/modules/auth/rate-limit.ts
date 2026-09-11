/**
 * Простой in-memory rate-limit (скользящее окно) для защиты от перебора/спама.
 *
 * Достаточно для одного инстанса (демо). Для многоинстансного прода — вынести
 * в общий store (Redis / таблица), см. TODO при провижининге инфраструктуры.
 */

type Bucket = { count: number; resetAt: number };

const globalForRl = globalThis as unknown as { rlBuckets?: Map<string, Bucket> };
const buckets = globalForRl.rlBuckets ?? new Map<string, Bucket>();
if (process.env.NODE_ENV !== "production") globalForRl.rlBuckets = buckets;

export type RateLimitResult = { allowed: boolean; retryAfterSec: number };

/**
 * Разрешает не более `limit` обращений за `windowSec` для ключа.
 * @param key например `request-code:<ip>` или `request-code:<phone>`
 */
export function rateLimit(key: string, limit: number, windowSec: number): RateLimitResult {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (b.count >= limit) {
    return { allowed: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

/** Достаёт IP клиента из заголовков запроса (за прокси/балансировщиком). */
export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
