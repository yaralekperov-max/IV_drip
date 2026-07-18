import { NextResponse } from "next/server";

/** Health-check эндпоинт. */
export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "vena",
    time: new Date().toISOString(),
  });
}
