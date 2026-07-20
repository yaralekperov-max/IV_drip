import { NextResponse } from "next/server";
import { parseWebhook } from "@/lib/modules/payments/yookassa";

/**
 * Приём уведомлений ЮKassa (payment.succeeded / canceled / refund.succeeded).
 * Всегда отвечаем 200, чтобы ЮKassa не повторяла доставку без нужды.
 *
 * TODO (после БД): обновлять статус платежа/визита в таблице payments;
 * в проде — проверять источник уведомления (IP-диапазоны ЮKassa) на границе (nginx/WAF).
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const event = parseWebhook(body);
  if (!event) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  console.info("[yookassa:webhook]", event.event, event.paymentId, event.status);
  // TODO: сопоставить paymentId с записью в payments и обновить статус.
  return NextResponse.json({ ok: true });
}
