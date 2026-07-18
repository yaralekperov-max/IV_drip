import type { BiomarkerParser, ParseResult } from "./types";

export type { BiomarkerParser, ParseResult, ParsedMarker } from "./types";

/**
 * Парсер по умолчанию — РУЧНОЙ ВВОД. Ничего не распознаёт автоматически:
 * врач вносит показатели вручную в экране проверки (админка → Анализы).
 *
 * Это безопасный старт по 152-ФЗ (медданные никуда не передаются) и соответствует
 * решению из docs/decisions.md: «на старте при малом потоке допустим ручной ввод».
 */
class ManualParser implements BiomarkerParser {
  readonly engine = "manual";
  async parse(): Promise<ParseResult> {
    return { markers: [], engine: this.engine, lab: null };
  }
}

/**
 * Заготовка РФ-парсера (self-hosted модель / жёсткий парсер под лабораторию).
 * Включается через BIOMARKER_PARSER=ru-selfhosted, когда решение будет согласовано.
 */
class SelfHostedRuParser implements BiomarkerParser {
  readonly engine = "ru-selfhosted";
  async parse(): Promise<ParseResult> {
    // TODO: вызов внутреннего сервиса распознавания в российском контуре (Compute Cloud).
    throw new Error("РФ-парсер ещё не реализован (нужно согласование и развёртывание).");
  }
}

let cached: BiomarkerParser | null = null;

/** Возвращает активный парсер по конфигу. По умолчанию — ручной ввод (152-ФЗ). */
export function getBiomarkerParser(): BiomarkerParser {
  if (cached) return cached;
  cached =
    process.env.BIOMARKER_PARSER === "ru-selfhosted" ? new SelfHostedRuParser() : new ManualParser();
  return cached;
}

/**
 * Сопоставляет исходное название показателя с кодом справочника по name/aliases.
 * Чистая функция — используется парсером и при ручной сверке.
 */
export function matchCatalogCode(
  rawName: string,
  catalog: { code: string; name: string; aliases?: string[] | null }[],
): string | null {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
  const target = norm(rawName);
  for (const b of catalog) {
    if (norm(b.name) === target) return b.code;
    if (b.aliases?.some((a) => norm(a) === target)) return b.code;
  }
  // Частичное совпадение как запасной вариант.
  for (const b of catalog) {
    if (target.includes(norm(b.name)) || norm(b.name).includes(target)) return b.code;
  }
  return null;
}
