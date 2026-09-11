/**
 * Небольшой CSV/TSV-парсер (RFC4180-совместимый: кавычки, экранирование "", переводы строк
 * внутри кавычек). Без внешних зависимостей.
 */
export function parseDelimited(input: string, delimiter: "," | "\t"): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  // Убираем BOM, если есть.
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') {
      inQuotes = true;
    } else if (c === delimiter) {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c === "\r") {
      // пропускаем — \r\n обработается на \n
    } else {
      field += c;
    }
  }
  // последний незакрытый ряд
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  // убираем полностью пустые строки
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}
