import { parseDelimited } from "./csv";
import { slugify } from "./slug";
import {
  biomarkerInputSchema,
  type BiomarkerInput,
  type ImportReport,
  type ReferenceRangeInput,
} from "./types";

/**
 * Гибкий импорт справочника биомаркеров из разных форматов.
 * Поддерживает: JSON (массив объектов), CSV, TSV.
 * Терпим к названиям колонок (ru/en) и умеет достроить недостающее (code из name, нормы из текста).
 *
 * Excel: сохрани лист как CSV — либо позже добавим прямое чтение .xlsx (нужна доп. библиотека).
 */

// Возможные заголовки колонок → каноническое поле.
const HEADER_ALIASES: Record<string, string[]> = {
  code: ["code", "код", "ключ", "id"],
  name: ["name", "название", "наименование", "показатель", "маркер", "биомаркер"],
  unit: ["unit", "units", "ед", "ед.", "единицы", "единица", "единицы измерения"],
  category: ["category", "категория", "группа", "раздел"],
  aliases: ["aliases", "синонимы", "псевдонимы", "альтернативные названия"],
  reference: ["reference", "норма", "нормы", "референс", "референсные значения", "референсный интервал"],
  min: ["min", "ref_min", "минимум", "мин", "норма мин", "нижняя граница"],
  max: ["max", "ref_max", "максимум", "макс", "норма макс", "верхняя граница"],
  sort: ["sort", "порядок", "сортировка", "order"],
  active: ["active", "активен", "активный", "включён", "вкл"],
  description: ["description", "описание", "комментарий"],
};

function canonicalHeader(raw: string): string | null {
  const h = raw.trim().toLowerCase();
  for (const [canonical, variants] of Object.entries(HEADER_ALIASES)) {
    if (variants.includes(h)) return canonical;
  }
  return null;
}

function detectFormat(fileName: string, content: string): "json" | "csv" | "tsv" {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".json")) return "json";
  if (lower.endsWith(".tsv")) return "tsv";
  if (lower.endsWith(".csv")) return "csv";
  // Автоопределение по содержимому.
  const trimmed = content.trimStart();
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) return "json";
  const firstLine = content.split("\n")[0] ?? "";
  if (firstLine.includes("\t")) return "tsv";
  return "csv";
}

function parseBool(v: unknown): boolean | undefined {
  if (typeof v === "boolean") return v;
  if (v == null) return undefined;
  const s = String(v).trim().toLowerCase();
  if (["1", "true", "да", "yes", "вкл", "активен", "y"].includes(s)) return true;
  if (["0", "false", "нет", "no", "выкл", "n"].includes(s)) return false;
  return undefined;
}

function parseNumber(v: unknown): number | undefined {
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
  if (v == null) return undefined;
  const s = String(v).replace(",", ".").replace(/\s/g, "").trim();
  if (s === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

function splitAliases(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (v == null) return [];
  return String(v)
    .split(/[;|,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Разбирает текстовую норму: «30–100», «30-100», «< 5», «> 200», «менее 5». */
export function parseReferenceText(text: string): ReferenceRangeInput {
  const t = text.trim().replace(/\s+/g, " ");
  const num = (s: string) => parseNumber(s);

  // диапазон a–b (тире, дефис, «..»)
  const range = t.match(/(-?\d+[.,]?\d*)\s*(?:[–—-]|\.\.|до)\s*(-?\d+[.,]?\d*)/i);
  if (range) {
    return { min: num(range[1]), max: num(range[2]) };
  }
  // < b / менее b / до b
  const lt = t.match(/(?:<|менее|до)\s*(-?\d+[.,]?\d*)/i);
  if (lt) return { max: num(lt[1]) };
  // > a / более a / от a
  const gt = t.match(/(?:>|более|от)\s*(-?\d+[.,]?\d*)/i);
  if (gt) return { min: num(gt[1]) };
  // одно число — трактуем как текст (не знаем, что это)
  return { text: t };
}

function normalizeRecord(raw: Record<string, unknown>, index: number): BiomarkerInput {
  const name = String(raw.name ?? "").trim();
  const code = String(raw.code ?? "").trim() || slugify(name || `biomarker_${index + 1}`);

  // referenceRanges: приоритет — явный массив (из JSON), затем min/max, затем текст «reference».
  let referenceRanges: ReferenceRangeInput[] = [];
  if (Array.isArray(raw.referenceRanges)) {
    referenceRanges = raw.referenceRanges as ReferenceRangeInput[];
  } else {
    const min = parseNumber(raw.min);
    const max = parseNumber(raw.max);
    if (min !== undefined || max !== undefined) {
      referenceRanges = [{ min, max }];
    } else if (raw.reference != null && String(raw.reference).trim() !== "") {
      referenceRanges = [parseReferenceText(String(raw.reference))];
    }
  }

  return biomarkerInputSchema.parse({
    code,
    name,
    unit: raw.unit != null ? String(raw.unit).trim() || undefined : undefined,
    category: raw.category != null ? String(raw.category).trim() || undefined : undefined,
    aliases: splitAliases(raw.aliases),
    referenceRanges,
    sort: parseNumber(raw.sort) ?? 0,
    active: parseBool(raw.active) ?? true,
    description: raw.description != null ? String(raw.description).trim() || undefined : undefined,
  });
}

/** Приводит строку таблицы (по заголовкам) к объекту с каноническими ключами. */
function rowToRaw(headers: (string | null)[], row: string[]): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  headers.forEach((h, i) => {
    if (h) obj[h] = row[i];
  });
  return obj;
}

/**
 * Главная функция: принимает содержимое файла и его имя, возвращает отчёт
 * с валидными записями и списком ошибок по строкам.
 */
export function importCatalog(fileName: string, content: string): ImportReport {
  const format = detectFormat(fileName, content);
  const valid: BiomarkerInput[] = [];
  const errors: { row: number; message: string }[] = [];

  let rawRecords: Record<string, unknown>[] = [];

  if (format === "json") {
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      return { format, total: 0, valid: [], errors: [{ row: 0, message: `Некорректный JSON: ${String(e)}` }] };
    }
    const arr = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object" && Array.isArray((parsed as { items?: unknown[] }).items)
        ? (parsed as { items: unknown[] }).items
        : null;
    if (!arr) {
      return { format, total: 0, valid: [], errors: [{ row: 0, message: "Ожидался массив объектов" }] };
    }
    rawRecords = arr as Record<string, unknown>[];
  } else {
    const rows = parseDelimited(content, format === "tsv" ? "\t" : ",");
    if (rows.length < 2) {
      return { format, total: 0, valid: [], errors: [{ row: 0, message: "Нет данных или отсутствует строка заголовков" }] };
    }
    const headers = rows[0].map(canonicalHeader);
    if (!headers.includes("name")) {
      return {
        format,
        total: 0,
        valid: [],
        errors: [{ row: 1, message: "Не найдена колонка с названием показателя (name/название/показатель)" }],
      };
    }
    rawRecords = rows.slice(1).map((r) => rowToRaw(headers, r));
  }

  rawRecords.forEach((raw, i) => {
    try {
      valid.push(normalizeRecord(raw, i));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push({ row: i + 1, message: msg });
    }
  });

  // Дедуп по code — последняя запись побеждает (с отметкой в ошибках).
  const byCode = new Map<string, BiomarkerInput>();
  for (const rec of valid) {
    if (byCode.has(rec.code)) {
      errors.push({ row: -1, message: `Дубликат code "${rec.code}" — оставлена последняя запись` });
    }
    byCode.set(rec.code, rec);
  }

  return { format, total: rawRecords.length, valid: [...byCode.values()], errors };
}
