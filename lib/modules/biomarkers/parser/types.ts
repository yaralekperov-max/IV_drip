/** Один распознанный показатель из PDF (до проверки врачом). */
export type ParsedMarker = {
  /** Как показатель назван в исходном бланке. */
  rawName: string;
  value: string | null;
  unit?: string | null;
  /** Сопоставленный код справочника (если удалось). */
  catalogCode?: string | null;
};

export type ParseResult = {
  lab?: string | null;
  markers: ParsedMarker[];
  /** Каким движком распознано (для аудита). */
  engine: string;
};

/**
 * Интерфейс парсера биомаркеров. Реализации подключаются по конфигу.
 *
 * 152-ФЗ (критично): в проде медданные НЕ уходят во внешние (зарубежные) ИИ-API.
 * Допустимо: ручной ввод врачом (по умолчанию), жёсткий парсер под 1-2 лаборатории,
 * или self-hosted модель внутри российского контура. Решение — за юристом.
 */
export interface BiomarkerParser {
  readonly engine: string;
  parse(pdf: Uint8Array, fileName: string): Promise<ParseResult>;
}
