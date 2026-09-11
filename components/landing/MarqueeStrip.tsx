const ITEMS = [
  "Энергия с доставкой",
  "Эффект с первого визита",
  "Без поездок в клинику",
  "Под контролем врача",
];

export function MarqueeStrip() {
  // Дублируем список, чтобы прокрутка на -50% была бесшовной.
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-y border-line-soft py-6">
      <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-16 font-display text-lg italic text-ink-dim after:text-gold after:content-['·']"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
