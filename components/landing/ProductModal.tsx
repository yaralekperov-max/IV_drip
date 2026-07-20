"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/content/products";
import { PRICING, formatRub } from "@/lib/content/pricing";

/** Подробная карточка продукта (модалка) — воссоздаёт pmodal из прототипа. */
export function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [contraOpen, setContraOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const composeTitle = product.compose ? "Что внутри" : "Как формируется состав";

  return (
    <div
      className="fixed inset-0 z-[500] flex items-start justify-center overflow-y-auto bg-[rgba(5,9,7,0.8)] p-5 backdrop-blur-md sm:p-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div className="relative w-full max-w-[760px] overflow-hidden rounded-3xl border border-line bg-bg-2">
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line-soft bg-bg/60 text-lg text-ink transition-colors hover:border-gold"
        >
          ✕
        </button>

        {/* hero */}
        <div className="relative overflow-hidden border-b border-line-soft bg-gradient-to-b from-panel-2 to-bg-2 px-6 pb-9 pt-12 sm:px-12">
          <div className="mb-4 text-[34px]">{product.icon}</div>
          <h3 className="mb-2.5 font-display text-[38px] font-light leading-[1.05] text-ink">
            {product.name}
          </h3>
          <div className="mb-7 font-display text-base italic text-gold-light">
            {product.tagline}
          </div>
          <div className="flex flex-wrap gap-7">
            <MetaItem value={product.time} label="длительность" />
            <MetaItem value="~100%" label="усвоение, минуя ЖКТ" />
            <MetaItem value="у вас" label="дома или в офисе" />
          </div>
        </div>

        {/* body */}
        <div className="px-6 pb-12 pt-10 sm:px-12">
          {/* promises */}
          <Section>
            <div className="grid gap-4 sm:grid-cols-3">
              {product.promises.map((p) => (
                <div key={p.title} className="rounded-2xl border border-line-soft p-5">
                  <div className="mb-3 text-[22px]">{p.ic}</div>
                  <h4 className="mb-1.5 text-[15px] font-medium text-ink">{p.title}</h4>
                  <p className="text-[13px] font-light leading-relaxed text-ink-muted">{p.text}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* composition */}
          <Section>
            <Label>{composeTitle}</Label>
            {product.compose ? (
              <>
                <ul>
                  {product.compose.map((ing) => (
                    <li
                      key={ing.name}
                      className="flex items-start gap-3.5 border-b border-line-soft py-3.5 last:border-none"
                    >
                      <span className="mt-[7px] h-[7px] w-[7px] flex-shrink-0 rounded-full bg-gold" />
                      <div>
                        <span className="text-[14.5px] font-medium text-ink">{ing.name}</span>
                        <span className="text-[13px] font-light text-ink-muted"> — {ing.why}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-2.5 text-[13px] text-gold-light">
                  🔒 Только оригинальные сертифицированные препараты
                </div>
              </>
            ) : (
              <p className="text-[14px] font-light leading-relaxed text-ink-muted">
                {product.customNote}
              </p>
            )}
          </Section>

          {/* why iv */}
          <Section>
            <Label>Почему капельница, а не таблетки</Label>
            <h4 className="font-display text-[22px] font-normal leading-tight text-ink">
              То, что таблетка теряет по дороге —{" "}
              <em className="italic text-gold-light">капельница доставляет целиком</em>
            </h4>
            <div className="mt-4 flex flex-col gap-3">
              {[
                "Усвоение почти 100%, минуя ЖКТ",
                "Эффект в тот же день, а не «когда-нибудь»",
                "Точная дозировка под вашу задачу",
              ].map((t) => (
                <div key={t} className="flex items-center gap-3 text-[14px] text-ink-muted">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-gold text-xs text-gold">
                    ✓
                  </span>
                  {t}
                </div>
              ))}
            </div>
          </Section>

          {/* when */}
          <Section>
            <Label>Когда это вам нужно</Label>
            <ul>
              {product.when.map((w) => (
                <li
                  key={w}
                  className="relative py-2 pl-[22px] text-[14px] font-light text-ink-muted before:absolute before:left-0 before:text-gold before:content-['—']"
                >
                  {w}
                </li>
              ))}
            </ul>
          </Section>

          {/* process 4 steps */}
          <Section>
            <Label>Как проходит — как доставка</Label>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
              {[
                ["1", "Заказываете", "визит или курс в пару кликов"],
                ["2", "Подбираем состав", "врач уточняет под вас"],
                ["3", "Привозим и ставим", "медсестра проводит инфузию у вас"],
                ["4", "Видите результат", "контроль анализов «было→стало»"],
              ].map(([n, h, p]) => (
                <div key={n}>
                  <div className="mb-3 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-gold font-display text-sm text-gold">
                    {n}
                  </div>
                  <h4 className="mb-1.5 text-[14px] font-medium text-ink">{h}</h4>
                  <p className="text-[12.5px] font-light leading-snug text-ink-dim">{p}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* result */}
          <Section>
            <Label>Результат</Label>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h4 className="mb-3.5 text-[14px] font-medium text-gold">Что вы почувствуете</h4>
                <ul>
                  {product.feel.map((f) => (
                    <li
                      key={f}
                      className="flex gap-2 py-1.5 text-[13.5px] font-light text-ink-muted before:text-gold before:content-['✓']"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-3.5 text-[14px] font-medium text-gold">Что увидите в кабинете</h4>
                <div className="rounded-2xl border border-line-soft bg-panel p-5">
                  {product.dyn.map((d) => (
                    <div key={d.name} className="mb-2.5 flex items-center gap-3 last:mb-0">
                      <div className="w-20 flex-shrink-0 text-[12.5px] text-ink-muted">{d.name}</div>
                      <div className="font-display text-[15px] text-ink">
                        {d.from} → <b className="text-gold-light">{d.to}</b>
                      </div>
                    </div>
                  ))}
                  <div className="mt-2.5 text-[12px] italic text-ink-dim">
                    Динамику видно, а не на слово
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* price */}
          <Section>
            <Label>Стоимость</Label>
            <div className="flex flex-wrap gap-4">
              <div className="min-w-[200px] flex-1 rounded-2xl border border-line-soft p-6">
                <div className="mb-2 text-[11px] uppercase tracking-wide text-gold">
                  Разовый визит
                </div>
                <div className="mb-1 font-display text-[30px] text-ink">
                  {formatRub(PRICING.single)}
                </div>
                <div className="text-[12.5px] text-ink-muted">один выезд бригады</div>
              </div>
              <div className="relative min-w-[200px] flex-1 rounded-2xl border border-gold bg-[rgba(201,168,106,0.06)] p-6">
                <div className="mb-2 text-[11px] uppercase tracking-wide text-gold">
                  Курс 4 визита · рекомендуем
                </div>
                <div className="mb-1 font-display text-[30px] text-gold-light">
                  {formatRub(PRICING.coursePerSession * 4)}
                </div>
                <div className="text-[12.5px] text-ink-muted">
                  {formatRub(PRICING.coursePerSession)} / визит · выгода 22%
                </div>
              </div>
            </div>
          </Section>

          {/* contraindications */}
          <Section>
            <div className="overflow-hidden rounded-xl border border-line-soft">
              <button
                onClick={() => setContraOpen((v) => !v)}
                className="flex w-full items-center justify-between px-5 py-4 text-[14px] text-ink-muted transition-colors hover:text-ink"
                aria-expanded={contraOpen}
              >
                <span>Противопоказания</span>
                <span className={`text-gold transition-transform ${contraOpen ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>
              {contraOpen && (
                <div className="px-5 pb-5 text-[13px] font-light leading-relaxed text-ink-dim">
                  Беременность и лактация (с осторожностью), острые инфекционные заболевания,
                  индивидуальная непереносимость компонентов, тяжёлая почечная или печёночная
                  недостаточность, возраст до 18 лет. Перед каждым визитом врач проверяет допуск по
                  противопоказаниям.
                </div>
              )}
            </div>
          </Section>

          {/* doctor */}
          <Section>
            <div className="flex items-center gap-4 rounded-2xl border border-line-soft bg-panel p-5">
              <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full border border-line bg-gradient-to-br from-[#2a4a3c] to-[#1a2e24] text-xl">
                🩺
              </div>
              <div>
                <div className="text-[11.5px] text-gold">Протокол составлен и проверен</div>
                <h4 className="my-0.5 text-[15px] font-medium text-ink">Соколова Е. А.</h4>
                <p className="text-[12.5px] text-ink-muted">врач-терапевт, к.м.н.</p>
              </div>
            </div>
          </Section>

          {/* cta */}
          <div className="pt-2">
            <div className="flex flex-wrap gap-3.5">
              <a
                href="#contact"
                onClick={onClose}
                className="min-w-[180px] flex-1 rounded-full bg-gold px-6 py-4 text-center text-[14.5px] font-medium text-bg transition-colors hover:bg-gold-light"
              >
                Записаться на визит
              </a>
              <a
                href="#calc"
                onClick={onClose}
                className="flex min-w-[180px] flex-1 items-center justify-center gap-2 text-center text-[14.5px] text-ink transition-colors hover:text-gold"
              >
                Выбрать курс
              </a>
            </div>
            <p className="mt-6 text-center text-[11.5px] italic leading-relaxed text-ink-dim">
              Составы приведены как типовые и утверждаются медицинским директором. Итоговый протокол
              подбирается врачом индивидуально. Имеются противопоказания, необходима консультация
              специалиста.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-[13px] text-ink-muted">
      <b className="mb-0.5 block font-display text-[18px] font-normal text-ink">{value}</b>
      {label}
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <div className="mb-9 last:mb-0">{children}</div>;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 text-[11.5px] uppercase tracking-[0.14em] text-gold">{children}</div>
  );
}
