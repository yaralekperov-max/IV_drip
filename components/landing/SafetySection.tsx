import { Reveal } from "./Reveal";
import { Accent } from "./SectionHeading";

const CARDS = [
  {
    mark: "I",
    title: "Лицензированная медицина",
    text: "Работаем на базе лицензированной клиники-партнёра. Договор с пациентом, протоколы, ответственность — всё в правовом поле.",
  },
  {
    mark: "II",
    title: "Врач, а не только медсестра",
    text: "Состав утверждает медицинский директор, противопоказания проверяются перед каждым визитом по протоколу.",
  },
  {
    mark: "III",
    title: "Полная экипировка",
    text: "Мониторинг показателей и реанимационный набор на каждом выезде — на случай любой нестандартной реакции.",
  },
];

export function SafetySection() {
  return (
    <section id="safety" className="bg-bg-2 px-6 py-[130px] sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <div className="mb-16 grid items-end gap-8 md:grid-cols-2 md:gap-16">
            <div>
              <div className="mb-5 text-[12.5px] uppercase tracking-[0.22em] text-gold">
                Почему это безопасно
              </div>
              <h2 className="max-w-[760px] font-display text-[clamp(32px,4.4vw,52px)] font-light leading-[1.12] tracking-tight text-ink">
                Рынок выездных капельниц серый. <Accent>Мы — нет.</Accent>
              </h2>
            </div>
            <p className="text-[17px] font-light leading-relaxed text-ink-muted">
              Большинство предложений — это медсёстры-фрилансеры без лицензии и врачебного контроля.
              Внутривенная инфузия — это медицинская манипуляция, и относиться к ней нужно
              соответственно.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {CARDS.map((c) => (
              <div
                key={c.mark}
                className="rounded-2xl border border-line-soft p-10 transition-all duration-500 hover:-translate-y-1 hover:border-line hover:bg-panel"
              >
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full border border-gold font-display text-lg text-gold">
                  {c.mark}
                </div>
                <h4 className="mb-3 text-[20px] font-normal text-ink">{c.title}</h4>
                <p className="text-[14.5px] font-light leading-relaxed text-ink-muted">{c.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
