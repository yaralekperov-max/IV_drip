import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/modules/auth/session";
import { createLead } from "@/lib/integrations/amocrm";

/**
 * Заявка на визит из ЛК → сделка «на подтверждении» в amoCRM (best-effort).
 * Запись = желаемый слот, оператор подтверждает доступность бригады (не автобронь).
 *
 * TODO (после провижининга БД): сохранять визит в таблицу visits (status=pending)
 * и связывать amocrm_id с клиентом.
 */
const schema = z.object({
  program: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  address: z.string().min(1),
  payment: z.string().min(1),
  priceRub: z.number().int().positive().optional(),
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
  const d = parsed.data;

  try {
    await createLead({
      name: session.name ?? "Клиент",
      phone: session.phone,
      interest: d.program,
      priceRub: d.priceRub,
      source: "booking",
      note: `Желаемый слот: ${d.date}, ${d.time} · ${d.address} · оплата: ${d.payment}`,
    });
  } catch (e) {
    console.error("[booking] amoCRM недоступен:", e);
  }

  return NextResponse.json({ ok: true, status: "pending" });
}
