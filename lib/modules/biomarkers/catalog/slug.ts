const MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

/** Транслитерация + slug: «Витамин D, 25-OH» → "vitamin_d_25_oh". Для авто-генерации code. */
export function slugify(input: string): string {
  const lower = input.toLowerCase().trim();
  let out = "";
  for (const ch of lower) {
    out += MAP[ch] ?? ch;
  }
  return (
    out
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .replace(/_{2,}/g, "_") || "biomarker"
  );
}
