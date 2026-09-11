import crypto from "node:crypto";

/**
 * Клиент ЮKassa (эквайринг). API v3.
 *
 * Конфиг: YOOKASSA_SHOP_ID, YOOKASSA_SECRET_KEY. Аутентификация — Basic (shopId:secretKey).
 * Если не настроено — режим «skip» (не роняет флоу; создание платежа вернёт not_configured).
 */

export function isYooKassaConfigured(): boolean {
  return Boolean(process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY);
}

const API = "https://api.yookassa.ru/v3";

export type CreatePaymentInput = {
  amountRub: number;
  description: string;
  /** Куда вернуть клиента после оплаты. */
  returnUrl: string;
  /** Ключ идемпотентности (защита от двойного списания). */
  idempotenceKey?: string;
};

export type CreatePaymentResult =
  | { configured: false }
  | { configured: true; id: string; status: string; confirmationUrl: string | null };

export async function createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secret = process.env.YOOKASSA_SECRET_KEY;
  if (!shopId || !secret) {
    console.info("[yookassa] skip (не настроено):", { amountRub: input.amountRub });
    return { configured: false };
  }

  const auth = Buffer.from(`${shopId}:${secret}`).toString("base64");
  const res = await fetch(`${API}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      "Idempotence-Key": input.idempotenceKey ?? crypto.randomUUID(),
    },
    body: JSON.stringify({
      amount: { value: input.amountRub.toFixed(2), currency: "RUB" },
      capture: true,
      confirmation: { type: "redirect", return_url: input.returnUrl },
      description: input.description,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ЮKassa ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    id: string;
    status: string;
    confirmation?: { confirmation_url?: string };
  };
  return {
    configured: true,
    id: data.id,
    status: data.status,
    confirmationUrl: data.confirmation?.confirmation_url ?? null,
  };
}

export type WebhookEvent = {
  event: string; // payment.succeeded, payment.canceled, refund.succeeded, ...
  paymentId?: string;
  status?: string;
};

/** Разбирает тело уведомления ЮKassa. */
export function parseWebhook(body: unknown): WebhookEvent | null {
  if (!body || typeof body !== "object") return null;
  const b = body as { event?: string; object?: { id?: string; status?: string } };
  if (!b.event) return null;
  return { event: b.event, paymentId: b.object?.id, status: b.object?.status };
}
