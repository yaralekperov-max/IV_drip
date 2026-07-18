import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizePhone } from "@/lib/modules/auth/phone";
import { issueCode } from "@/lib/modules/auth/otp-store";
import { getSmsSender } from "@/lib/modules/auth/sms";

const schema = z.object({
  phone: z.string().min(5),
  name: z.string().min(1).max(120).optional(),
});

/** Шаг 1 входа: выдать и отправить SMS-код. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const phone = normalizePhone(parsed.data.phone);
  if (!phone) {
    return NextResponse.json({ ok: false, error: "bad_phone" }, { status: 422 });
  }

  const code = issueCode(phone, parsed.data.name);
  const sender = getSmsSender();
  try {
    await sender.send(phone, `VENA: код для входа — ${code}`);
  } catch (e) {
    console.error("[auth] не удалось отправить SMS:", e);
    return NextResponse.json({ ok: false, error: "sms_failed" }, { status: 502 });
  }

  // Для dev-провайдера (без реальной отправки) возвращаем код, чтобы можно было залогиниться на демо.
  const devCode = sender.name.includes("dev") ? code : undefined;
  return NextResponse.json({ ok: true, phone, devCode });
}
