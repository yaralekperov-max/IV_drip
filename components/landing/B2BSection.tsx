import { Reveal } from "./Reveal";
import { PRICING, formatRub } from "@/lib/content/pricing";

export function B2BSection() {
  const specs = [
    { k: "Формат", v: "Drip-day" },
    { k: "Минимум участников", v: String(PRICING.b2bMinParticipants) },
    { k: "За человека", v: formatRub(PRICING.b2bPerPerson) },
    { k: "На сотрудника", v: "45–60 мин" },
  ];

  return (
    <section id="b2b" className="px-6 py-[130px] sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <div className="relative grid items-center gap-12 overflow-hidden rounded-[28px] border border-line bg-gradient-to-br from-panel-2 to-bg-2 p-8 sm:p-12 md:grid-cols-[1.1fr_0.9fr] md:gap-[72px] md:p-20">
            <div
              className="pointer-events-none absolute -bottom-[40%] -left-[10%] h-[400px] w-[400px] rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(201,168,106,0.10), transparent 70%)",
              }}
            />
            <div className="relative">
              <div className="mb-5 text-[12.5px] uppercase tracking-[0.22em] text-gold">
                Для компаний
              </div>
              <h2 className="mb-5 font-display text-[clamp(28px,3.4vw,42px)] font-light leading-tight text-ink">
                Доставляем энергию <em className="italic text-gold-light">всей команде</em>
              </h2>
              <p className="mb-9 text-[17px] font-light leading-relaxed text-ink-muted">
                Drip-day — один выезд бригады в офис на весь день. Сотрудники получают
                восстановление между встречами, без поездок и потери рабочего времени.
              </p>
              <a
                href="#contact"
                className="inline-block rounded-full bg-gold px-9 py-4 text-[14.5px] font-medium text-bg transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-gold"
              >
                Обсудить для своей компании
              </a>
            </div>
            <div className="relative">
              {specs.map((s) => (
                <div
                  key={s.k}
                  className="flex items-baseline justify-between border-b border-line-soft py-[18px] last:border-none"
                >
                  <span className="text-[14px] font-light text-ink-muted">{s.k}</span>
                  <span className="font-display text-[22px] text-gold-light">{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
