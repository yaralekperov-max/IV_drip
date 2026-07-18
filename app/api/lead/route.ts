import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Приём заявки с лендинга. ЗАГЛУШКА (Этап 2).
 * На Этапе 6 здесь создаётся лид в amoCRM (lib/integrations/amocrm).
 * Пока — валидируем и возвращаем ok, без сохранения ПДн.
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

  // TODO (Этап 6): создать лид в amoCRM. Сейчас заявку не сохраняем.
  console.info("[lead] новая заявка (заглушка):", { interest: parsed.data.interest });

  return NextResponse.json({ ok: true });
}
