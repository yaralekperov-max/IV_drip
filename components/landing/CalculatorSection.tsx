"use client";

import { useState } from "react";
import { PRICING, formatRub } from "@/lib/content/pricing";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils/cn";

type Mode = "single" | "course";

export function CalculatorSection() {
  const [mode, setMode] = useState<Mode>("single");
  const [sessions, setSessions] = useState<number>(PRICING.courseMin);

  const isCourse = mode === "course";
  const total = isCourse ? sessions * PRICING.coursePerSession : PRICING.single;
  const save = isCourse ? sessions * PRICING.single - total : 0;

  return (
    <section id="calc" className="px-6 py-[130px] sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          {/* left */}
          <Reveal>
            <SectionHeading eyebrow="Форматы доставки">
              Разовая доставка
              <br />
              или курс
            </SectionHeading>
            <p className="mb-10 mt-6 max-w-[440px] text-[17px] font-light text-ink-muted">
              Эффект от капельниц накопительный — поэтому курс работает сильнее и выходит выгоднее.
              Выберите формат и посмотрите стоимость.
            </p>
            <div className="mb-9 flex gap-2.5">
              <ModeButton active={!isCourse} onClick={() => setMode("single")} name="Разовый визит" sub="попробовать формат" />
              <ModeButton active={isCourse} onClick={() => setMode("course")} name="Курс" sub="накопительный эффект" />
            </div>
            {isCourse && (
              <div>
                <div className="mb-4 flex justify-between text-[14px] text-ink-muted">
                  <span>Сеансов в курсе</span>
                  <b className="font-display text-[18px] font-medium text-gold-light">{sessions}</b>
                </div>
                <input
                  type="range"
                  min={PRICING.courseMin}
                  max={PRICING.courseMax}
                  step={1}
                  value={sessions}
                  onChange={(e) => setSessions(Number(e.target.value))}
                  className="h-0.5 w-full cursor-pointer appearance-none rounded bg-line accent-gold"
                  aria-label="Число сеансов в курсе"
                />
              </div>
            )}
          </Reveal>

          {/* right panel */}
          <Reveal>
            <div className="relative overflow-hidden rounded-[20px] border border-line bg-gradient-to-br from-panel to-bg-2 p-12">
              <div
                className="pointer-events-none absolute -right-[30%] -top-1/2 h-[300px] w-[300px] rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(201,168,106,0.10), transparent 70%)",
                }}
              />
              <div className="relative mb-2 text-[12.5px] uppercase tracking-[0.16em] text-gold">
                {isCourse ? `Курс ${sessions} сеансов` : "Разовый визит"}
              </div>
              <div className="relative mb-2.5 font-display text-[62px] font-light leading-none text-ink">
                {formatRub(total)}
              </div>
              <div className="relative mb-8 text-[15px] text-ink-muted">
                {isCourse ? (
                  <>
                    <b className="text-gold-light">{formatRub(PRICING.coursePerSession)}</b> за сеанс
                    · раз в неделю
                  </>
                ) : (
                  "один выезд бригады"
                )}
              </div>
              <div className="relative border-t border-line-soft pt-6">
                <Line k="Цена за сеанс" v={formatRub(isCourse ? PRICING.coursePerSession : PRICING.single)} />
                <Line k="Выезд и работа бригады" v="включено" />
                <Line k="Подбор состава врачом" v="включено" />
                {isCourse && <Line k="Ваша выгода против разовых" v={formatRub(save)} highlight />}
              </div>
              <a
                href="#contact"
                className="relative mt-8 block rounded-full bg-gold py-4 text-center text-[14.5px] font-medium text-bg transition-colors hover:bg-gold-light"
              >
                Записаться на этот формат
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ModeButton({
  active,
  onClick,
  name,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  name: string;
  sub: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 rounded-xl border p-[18px] text-center transition-all duration-300",
        active ? "border-gold bg-[rgba(201,168,106,0.07)]" : "border-line-soft",
      )}
    >
      <div className="mb-1 text-[14px] font-medium text-ink">{name}</div>
      <div className="text-[12.5px] text-ink-dim">{sub}</div>
    </button>
  );
}

function Line({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between py-[11px] text-[14px]">
      <span className="font-light text-ink-muted">{k}</span>
      <span className={highlight ? "font-medium text-gold-light" : "text-ink"}>{v}</span>
    </div>
  );
}
