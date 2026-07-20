import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizePhone } from "@/lib/modules/auth/phone";
import { verifyCode } from "@/lib/modules/auth/otp-store";
import { setSession } from "@/lib/modules/auth/session";

const schema = z.object({
  phone: z.string().min(5),
  code: z.string().regex(/^\d{4}$/, "код из 4 цифр"),
  name: z.string().min(1).max(120).optional(),
});

/** Шаг 2 входа: проверить код и открыть сессию. */
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

  const result = verifyCode(phone, parsed.data.code);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 401 });
  }

  const name = result.name ?? parsed.data.name;
  await setSession({ phone, name, iat: Math.floor(Date.now() / 1000) });
  return NextResponse.json({ ok: true });
}
