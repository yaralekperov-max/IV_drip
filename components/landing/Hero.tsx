import { IvDripSvg } from "./IvDripSvg";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center px-6 pb-20 pt-40 sm:px-10">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="grid items-center gap-10 md:grid-cols-[1.15fr_0.85fr]">
          <div className="order-2 md:order-1">
            <div className="mb-8 flex items-center gap-3.5 text-[12.5px] uppercase tracking-[0.22em] text-gold">
              <span className="h-px w-10 bg-gold" />
              Выездная IV-терапия
            </div>
            <h1 className="mb-8 font-display text-[clamp(42px,5.4vw,72px)] font-light leading-[1.05] tracking-tight text-ink">
              Энергия и тонус.
              <br />
              <em className="font-normal not-italic text-gold-light">С доставкой к вам</em>
            </h1>
            <p className="mb-11 max-w-[480px] text-[19px] font-light leading-relaxed text-ink-muted">
              Привозим не капельницу — привозим состояние: силы, ясность, восстановление. По
              врачебному протоколу, туда, где вам удобно: домой, в офис, между встречами.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="rounded-full bg-gold px-9 py-4 text-[14.5px] font-medium text-bg transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-gold"
              >
                Записаться на консультацию
              </a>
              <a
                href="#goals"
                className="group flex items-center gap-2.5 text-[14.5px] text-ink transition-colors hover:text-gold"
              >
                Что доставляем
                <span className="text-lg transition-all group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
          <div className="order-1 flex h-[460px] justify-center md:order-2 md:h-[560px]">
            <IvDripSvg />
          </div>
        </div>
      </div>
    </section>
  );
}
