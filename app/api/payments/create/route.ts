import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/modules/auth/session";
import { createPayment } from "@/lib/modules/payments/yookassa";

/**
 * Создание платежа ЮKassa. Возвращает confirmationUrl для редиректа на оплату.
 * Если ЮKassa не настроена — 503 not_configured (флоу оплаты недоступен на моках).
 *
 * TODO (после БД): сохранять платёж в таблицу payments (yookassa_id, статус).
 */
const schema = z.object({
  amountRub: z.number().int().positive(),
  description: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const origin = new URL(request.url).origin;
  try {
    const result = await createPayment({
      amountRub: parsed.data.amountRub,
      description: parsed.data.description,
      returnUrl: `${origin}/portal/payments`,
    });
    if (!result.configured) {
      return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
    }
    return NextResponse.json({
      ok: true,
      paymentId: result.id,
      status: result.status,
      confirmationUrl: result.confirmationUrl,
    });
  } catch (e) {
    console.error("[payments] ЮKassa ошибка:", e);
    return NextResponse.json({ ok: false, error: "provider_error" }, { status: 502 });
  }
}
