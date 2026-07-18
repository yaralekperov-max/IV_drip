import { NextResponse } from "next/server";
import { clearSession } from "@/lib/modules/auth/session";

/** Выход: удалить сессию. */
export async function POST() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
