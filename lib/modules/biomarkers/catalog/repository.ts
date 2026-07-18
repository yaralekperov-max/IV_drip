import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { biomarkerCatalog } from "@/lib/db/schema";
import type { BiomarkerInput } from "./types";

/**
 * Upsert справочника по `code` (idempotent — повторная загрузка обновляет, а не дублирует).
 * Возвращает число обработанных записей.
 */
export async function upsertBiomarkers(records: BiomarkerInput[]): Promise<number> {
  if (records.length === 0) return 0;

  const rows = records.map((r) => ({
    code: r.code,
    name: r.name,
    unit: r.unit,
    category: r.category,
    aliases: r.aliases,
    referenceRanges: r.referenceRanges,
    sort: r.sort,
    active: r.active,
    description: r.description,
    updatedAt: new Date(),
  }));

  await db
    .insert(biomarkerCatalog)
    .values(rows)
    .onConflictDoUpdate({
      target: biomarkerCatalog.code,
      set: {
        name: sqlExcluded("name"),
        unit: sqlExcluded("unit"),
        category: sqlExcluded("category"),
        aliases: sqlExcluded("aliases"),
        referenceRanges: sqlExcluded("reference_ranges"),
        sort: sqlExcluded("sort"),
        active: sqlExcluded("active"),
        description: sqlExcluded("description"),
        updatedAt: new Date(),
      },
    });

  return rows.length;
}

/** Активные показатели справочника, отсортированные для отображения. */
export async function listActiveBiomarkers() {
  return db
    .select()
    .from(biomarkerCatalog)
    .where(eq(biomarkerCatalog.active, true))
    .orderBy(asc(biomarkerCatalog.sort), asc(biomarkerCatalog.name));
}

// Хелпер для onConflictDoUpdate: взять значение из вставляемой строки (EXCLUDED.<col>).
import { sql } from "drizzle-orm";
function sqlExcluded(column: string) {
  return sql.raw(`excluded.${column}`);
}
