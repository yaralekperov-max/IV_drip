import { NextResponse } from "next/server";
import { importCatalog } from "@/lib/modules/biomarkers/catalog/import";
import { upsertBiomarkers } from "@/lib/modules/biomarkers/catalog/repository";

/**
 * Импорт справочника биомаркеров через загрузку файла в админке.
 * Принимает multipart/form-data с полем `file` (CSV/TSV/JSON).
 *
 * ?dryRun=1 — только разобрать и вернуть отчёт, без записи в БД (предпросмотр).
 *
 * TODO (Этап 6): ограничить доступ ролью staff (admin/doctor) — сейчас админка открыта.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const dryRun = url.searchParams.get("dryRun") === "1";

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "no_file" }, { status: 422 });
  }

  const content = await file.text();
  const report = importCatalog(file.name, content);

  if (report.valid.length === 0) {
    return NextResponse.json({ ok: false, error: "no_valid_rows", report }, { status: 422 });
  }

  if (dryRun) {
    return NextResponse.json({ ok: true, dryRun: true, report });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { ok: false, error: "no_database", report },
      { status: 503 },
    );
  }

  const count = await upsertBiomarkers(report.valid);
  return NextResponse.json({
    ok: true,
    imported: count,
    report: { format: report.format, total: report.total, errors: report.errors },
  });
}
