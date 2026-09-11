/**
 * История замеров биомаркеров клиента (моки).
 *
 * После подключения БД (Этап 5) данные придут из medical.biomarker_results —
 * только подтверждённые врачом (status = approved). Структура здесь совпадает
 * с тем, что вернёт репозиторий, чтобы замена моков была бесшовной.
 */

export type MarkerPoint = {
  /** ISO-дата замера (для оси времени). */
  date: string;
  /** Человекочитаемая подпись даты. */
  label: string;
  value: number;
};

export type MarkerHistory = {
  code: string;
  name: string;
  unit: string;
  /** Границы нормы (для полосы «норма» на графике). */
  refMin?: number;
  refMax?: number;
  points: MarkerPoint[];
};

export const BIOMARKER_HISTORY: MarkerHistory[] = [
  {
    code: "vitamin_d_25oh",
    name: "Витамин D, 25-OH",
    unit: "нг/мл",
    refMin: 30,
    refMax: 100,
    points: [
      { date: "2026-05-12", label: "12 мая", value: 19 },
      { date: "2026-06-14", label: "14 июня", value: 37 },
      { date: "2026-07-20", label: "20 июля", value: 52 },
    ],
  },
  {
    code: "ferritin",
    name: "Ферритин",
    unit: "нг/мл",
    refMin: 30,
    refMax: 400,
    points: [
      { date: "2026-05-12", label: "12 мая", value: 22 },
      { date: "2026-06-14", label: "14 июня", value: 48 },
      { date: "2026-07-20", label: "20 июля", value: 65 },
    ],
  },
  {
    code: "b12",
    name: "Витамин B12",
    unit: "пг/мл",
    refMin: 200,
    refMax: 900,
    points: [
      { date: "2026-05-12", label: "12 мая", value: 310 },
      { date: "2026-06-14", label: "14 июня", value: 450 },
      { date: "2026-07-20", label: "20 июля", value: 540 },
    ],
  },
];

/** Изменение между первым и последним замером. */
export function markerDelta(h: MarkerHistory): { delta: number; first: MarkerPoint; last: MarkerPoint } | null {
  if (h.points.length < 2) return null;
  const first = h.points[0];
  const last = h.points[h.points.length - 1];
  return { delta: last.value - first.value, first, last };
}

/** Попадает ли значение в норму. */
export function inReference(h: MarkerHistory, value: number): boolean {
  if (h.refMin !== undefined && value < h.refMin) return false;
  if (h.refMax !== undefined && value > h.refMax) return false;
  return true;
}
