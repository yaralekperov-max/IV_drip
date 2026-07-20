/**
 * Цены (источник — docs/decisions.md). Утверждаются бизнесом/меддиректором.
 * Держим в конфиге, чтобы менять без правок компонентов.
 */
export const PRICING = {
  /** Разовый визит, ₽ */
  single: 18_000,
  /** Цена одного сеанса в курсе, ₽ */
  coursePerSession: 14_000,
  /** Границы слайдера числа сеансов в курсе */
  courseMin: 4,
  courseMax: 10,
  /** Корпоративный drip-day, ₽/чел (от 8 участников) */
  b2bPerPerson: 10_000,
  b2bMinParticipants: 8,
} as const;

/** Форматирование рублей в ru-RU. */
export function formatRub(value: number): string {
  return `${value.toLocaleString("ru-RU")} ₽`;
}
