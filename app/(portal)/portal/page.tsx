"use client";

import Link from "next/link";
import { usePortalState } from "@/components/portal/PortalState";
import { PCard, CardHead, Row, ScreenHeader, Eyebrow, PLink } from "@/components/portal/ui";

export default function HomePage() {
  const { state } = usePortalState();

  if (state === "new") {
    return (
      <>
        <ScreenHeader
          title="Добро пожаловать,"
          accent="Александр"
          subtitle="Ваш кабинет готов. Начните с первой записи — бригада приедет к вам."
        />
        <PCard>
          <div className="px-6 py-[50px] text-center">
            <div className="mb-4 text-[40px] opacity-70">✦</div>
            <h3 className="mb-2 text-xl font-normal text-ink">Здесь появятся ваши визиты</h3>
            <p className="mx-auto mb-[22px] max-w-[400px] text-[14px] font-light text-ink-muted">
              Запишитесь на первую капельницу — выберите программу, удобное время и адрес. Дальше тут
              будут статус визита, динамика анализов и история.
            </p>
            <Link
              href="/portal/booking"
              className="inline-block rounded-full bg-gold px-7 py-3.5 text-[14px] font-medium text-bg transition-colors hover:bg-gold-light"
            >
              Записаться на визит
            </Link>
          </div>
        </PCard>
        <PCard>
          <CardHead title="Что вы получите" />
          <Row>
            <div className="flex-grow">
              <h4 className="text-[14px] font-medium text-ink">Выезд врача и медсестры к вам</h4>
              <p className="text-[12.5px] text-ink-dim">Домой, в офис, между встречами</p>
            </div>
          </Row>
          <Row>
            <div className="flex-grow">
              <h4 className="text-[14px] font-medium text-ink">Динамику анализов было→стало</h4>
              <p className="text-[12.5px] text-ink-dim">Загружаете результаты — видите прогресс</p>
            </div>
          </Row>
          <Row>
            <div className="flex-grow">
              <h4 className="text-[14px] font-medium text-ink">Личное ведение врачом</h4>
              <p className="text-[12.5px] text-ink-dim">Протокол под вашу цель и состояние</p>
            </div>
          </Row>
        </PCard>
      </>
    );
  }

  return (
    <>
      <ScreenHeader
        title="С возвращением,"
        accent="Александр"
        subtitle="Ваша бригада уже в пути — следующий визит сегодня."
      />
      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <div>
          <PCard className="border-gold bg-gradient-to-br from-panel-2 to-bg-2">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-[11px] w-[11px] rounded-full bg-status-pos" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.05em] text-status-pos">
                Бригада в пути
              </span>
            </div>
            <div className="mb-1 font-display text-[32px] text-gold-light">≈ 14 минут</div>
            <div className="mb-[18px] text-[13px] text-ink-muted">Прибытие к 14:30 · Пресненский</div>
            <Row className="border-t border-line-soft pt-3.5">
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-line bg-gradient-to-br from-[#2a4a3c] to-[#1a2e24]">
                👩‍⚕️
              </div>
              <div className="flex-grow">
                <h4 className="text-[14px] font-medium text-ink">Медсестра Ольга</h4>
                <p className="text-[12.5px] text-ink-dim">ваш постоянный специалист · 4.9★</p>
              </div>
            </Row>
          </PCard>

          <PCard className="border-line bg-gradient-to-br from-panel-2 to-bg-2">
            <Eyebrow className="mb-3">Повторить последнее</Eyebrow>
            <div className="mb-1.5 font-display text-[26px] text-ink">Капельница «Энергия+»</div>
            <div className="mb-5 text-[13px] text-ink-muted">Последний визит — 14 июня · дома</div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/portal/booking"
                className="rounded-full bg-gold px-6 py-3 text-[14px] font-medium text-bg transition-colors hover:bg-gold-light"
              >
                Записаться в один тап
              </Link>
              <Link
                href="/portal/booking"
                className="rounded-full border border-line px-5 py-3 text-[14px] text-ink transition-colors hover:border-gold"
              >
                Другую
              </Link>
            </div>
          </PCard>

          <PCard>
            <CardHead title="Ваш курс" action={<Eyebrow>Энергия · 4 визита</Eyebrow>} />
            <div className="mb-4 flex items-baseline gap-2.5">
              <b className="font-display text-[30px] text-gold-light">3</b>
              <span className="text-[14px] text-ink-muted">из 4 пройдено</span>
            </div>
            <div className="flex gap-2">
              <Bar filled />
              <Bar filled />
              <Bar filled />
              <Bar />
            </div>
          </PCard>
        </div>

        <div>
          <PCard>
            <Eyebrow className="mb-3.5">Вас ведёт</Eyebrow>
            <Row className="border-none p-0">
              <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-line bg-gradient-to-br from-[#2a4a3c] to-[#1a2e24] text-xl">
                🩺
              </div>
              <div className="flex-grow">
                <h4 className="text-[14px] font-medium text-ink">Соколова Е. А.</h4>
                <p className="text-[12.5px] text-ink-dim">терапевт · к.м.н. · 4.9★</p>
              </div>
            </Row>
          </PCard>

          <PCard>
            <CardHead title="Подготовка к визиту" />
            {[
              "Выпейте 1–2 стакана воды за час",
              "Не ешьте тяжёлое за 1.5 часа",
              "Освободите руку, удобная одежда",
            ].map((t) => (
              <div key={t} className="flex items-center gap-3 py-2.5">
                <span className="text-gold">✓</span>
                <p className="text-[13.5px] text-ink-muted">{t}</p>
              </div>
            ))}
          </PCard>

          <PCard>
            <CardHead
              title="Динамика"
              action={
                <Link href="/portal/analyses">
                  <PLink>Анализы →</PLink>
                </Link>
              }
            />
            <div className="mb-1.5 text-[13px] text-ink-muted">Витамин D</div>
            <div className="mb-3 font-display text-[15px] text-ink">
              19 → <b className="text-gold-light">37</b> нг/мл
            </div>
            <div className="mb-1.5 text-[13px] text-ink-muted">Ферритин</div>
            <div className="font-display text-[15px] text-ink">
              22 → <b className="text-gold-light">48</b> нг/мл
            </div>
          </PCard>
        </div>
      </div>
    </>
  );
}

function Bar({ filled }: { filled?: boolean }) {
  return <div className={`h-1.5 flex-1 rounded-[3px] ${filled ? "bg-gold" : "bg-line-soft"}`} />;
}
