/**
 * Нормализация российских номеров к формату +7XXXXXXXXXX.
 * Возвращает null, если номер не похож на валидный российский мобильный.
 */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  let d = digits;
  if (d.length === 11 && (d.startsWith("8") || d.startsWith("7"))) {
    d = "7" + d.slice(1);
  } else if (d.length === 10) {
    d = "7" + d;
  } else {
    return null;
  }
  if (!d.startsWith("7") || d.length !== 11) return null;
  return "+" + d;
}

/** Маска для отображения: +7 916 ··· ·· 02 */
export function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length !== 11) return phone;
  return `+7 ${d.slice(1, 4)} ··· ·· ${d.slice(9)}`;
}
