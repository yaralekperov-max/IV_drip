/**
 * Загрузка справочника биомаркеров в БД.
 *
 * Запуск:
 *   npm run db:seed:biomarkers -- <путь-к-файлу>
 * Примеры:
 *   npm run db:seed:biomarkers -- data/biomarkers.json
 *   npm run db:seed:biomarkers -- data/biomarkers.sample.csv
 *
 * Если путь не указан — берётся data/biomarkers.json, иначе data/biomarkers.sample.json.
 * Формат определяется автоматически (JSON / CSV / TSV). Повторный запуск обновляет
 * записи по code (idempotent). Требует DATABASE_URL (Managed PostgreSQL, 152-ФЗ — РФ).
 */
import fs from "node:fs";
import path from "node:path";
import { importCatalog } from "@/lib/modules/biomarkers/catalog/import";
import { upsertBiomarkers } from "@/lib/modules/biomarkers/catalog/repository";

async function main() {
  const arg = process.argv[2];
  const candidates = arg
    ? [arg]
    : ["data/biomarkers.json", "data/biomarkers.sample.json"];

  const filePath = candidates.map((c) => path.resolve(process.cwd(), c)).find((p) => fs.existsSync(p));
  if (!filePath) {
    console.error(`Файл не найден. Указан: ${arg ?? "(по умолчанию)"}. Проверьте путь.`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, "utf8");
  const report = importCatalog(path.basename(filePath), content);

  console.info(`Файл: ${filePath}`);
  console.info(`Формат: ${report.format} · строк: ${report.total} · валидных: ${report.valid.length}`);
  if (report.errors.length) {
    console.warn(`Замечания (${report.errors.length}):`);
    for (const e of report.errors.slice(0, 20)) {
      console.warn(`  строка ${e.row}: ${e.message}`);
    }
  }
  if (report.valid.length === 0) {
    console.error("Нет валидных записей для загрузки.");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error(
      "DATABASE_URL не задан — загрузка в БД пропущена. Заполните .env.local (Managed PostgreSQL).",
    );
    process.exit(1);
  }

  const count = await upsertBiomarkers(report.valid);
  console.info(`✓ Загружено/обновлено записей: ${count}`);
  process.exit(0);
}

main().catch((e) => {
  console.error("Ошибка загрузки:", e);
  process.exit(1);
});
