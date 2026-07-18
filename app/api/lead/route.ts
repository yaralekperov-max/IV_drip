import { NextResponse } from "next/server";
import { z } from "zod";
import { createLead } from "@/lib/integrations/amocrm";

/**
 * Приём заявки с лендинга → создание лида в amoCRM (best-effort).
 * Если amoCRM не настроен — заявка всё равно принимается (лид пропускается).
 */

const leadSchema = z.object({
  name: z.string().min(1, "Укажите имя").max(120),
  phone: z.string().min(5, "Укажите телефон").max(30),
  interest: z.string().max(60).optional(),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    await createLead({
      name: parsed.data.name,
      phone: parsed.data.phone,
      interest: parsed.data.interest,
      source: "landing",
    });
  } catch (e) {
    // Не роняем заявку из-за сбоя CRM — фиксируем и отвечаем клиенту ok.
    console.error("[lead] amoCRM недоступен:", e);
  }

  return NextResponse.json({ ok: true });
}
