/**
 * Низкоуровневый клиент amoCRM (API v4).
 *
 * Конфиг из окружения: AMOCRM_BASE_URL (напр. https://vena.amocrm.ru),
 * AMOCRM_ACCESS_TOKEN (долгосрочный токен интеграции).
 *
 * Если не настроено — интеграция работает в режиме «skip»: не роняет приложение,
 * а логирует и возвращает { skipped: true }. Это позволяет разрабатывать на моках
 * и включить реальную отправку простым добавлением ключей.
 */

export function isAmoConfigured(): boolean {
  return Boolean(process.env.AMOCRM_BASE_URL && process.env.AMOCRM_ACCESS_TOKEN);
}

type AmoFetchInit = {
  method?: string;
  body?: unknown;
};

export async function amoFetch<T = unknown>(path: string, init: AmoFetchInit = {}): Promise<T> {
  const base = process.env.AMOCRM_BASE_URL;
  const token = process.env.AMOCRM_ACCESS_TOKEN;
  if (!base || !token) {
    throw new Error("amoCRM не настроен (AMOCRM_BASE_URL / AMOCRM_ACCESS_TOKEN).");
  }
  const res = await fetch(`${base.replace(/\/$/, "")}${path}`, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`amoCRM ${res.status}: ${text.slice(0, 300)}`);
  }
  // 204 No Content возможен
  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
}
