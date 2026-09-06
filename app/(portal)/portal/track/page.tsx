"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { PCard, CardHead, ScreenHeader, Eyebrow, StatusBadge } from "@/components/portal/ui";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils/cn";

/**
 * Отслеживание визита в реальном времени (мок).
 *
 * ETA считается клиентским таймером от начального значения; позиция бригады на схеме
 * маршрута вычисляется из прогресса, а не анимируется «сама по себе» — то есть точка
 * всегда соответствует показанному времени.
 *
 * После подключения БД/бэкенда: ETA и координаты приходят от диспетчерской (polling/SSE).
 */

const INITIAL_ETA_SEC = 14 * 60;

const STEPS = [
  { key: "confirmed", label: "Заявка подтверждена", hint: "оператор проверил слот" },
  { key: "departed", label: "Бригада выехала", hint: "медсестра Ольга · 13:52" },
  { key: "enroute", label: "В пути к вам", hint: "Пресненский р-н" },
  { key: "arrived", label: "Прибыла", hint: "ожидаемо к 14:30" },
] as const;

export default function TrackPage() {
  const toast = useToast();
  const [etaSec, setEtaSec] = useState(INITIAL_ETA_SEC);
  const pathRef = useRef<SVGPathElement>(null);
  const [dot, setDot] = useState<{ x: number; y: number } | null>(null);

  // Обратный отсчёт
  useEffect(() => {
    if (etaSec <= 0) return;
    const id = setInterval(() => setEtaSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [etaSec]);

  const progress = useMemo(
    () => 1 - etaSec / INITIAL_ETA_SEC,
    [etaSec],
  );

  // Позиция точки на маршруте = прогресс поездки
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const p = path.getPointAtLength(len * Math.min(1, Math.max(0, progress)));
    setDot({ x: p.x, y: p.y });
  }, [progress]);

  const arrived = etaSec === 0;
  const currentStep = arrived ? 3 : 2;

  const mm = Math.floor(etaSec / 60);

  return (
    <>
      <ScreenHeader
        title="Бригада"
        accent="в пути"
        subtitle="Следите за прибытием в реальном времени."
      />

      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <div>
          {/* ETA + карта */}
          <PCard className="border-gold bg-gradient-to-br from-panel-2 to-bg-2">
            <div className="mb-4 flex items-center gap-3">
              <span
                className={cn(
                  "inline-block h-[11px] w-[11px] rounded-full",
                  arrived ? "bg-gold" : "animate-pulse bg-status-pos",
                )}
              />
              <span
                className={cn(
                  "text-[12px] font-semibold uppercase tracking-[0.05em]",
                  arrived ? "text-gold" : "text-status-pos",
                )}
              >
                {arrived ? "Бригада прибыла" : "Бригада в пути"}
              </span>
            </div>

            {/* Формат «13 мин», а не «13:59» — иначе читается как время прибытия. */}
            {arrived ? (
              <div className="mb-1 font-display text-[32px] text-gold-light">Уже у вас</div>
            ) : (
              <div className="mb-1 font-display text-[32px] text-gold-light">
                {mm >= 1 ? (
                  <>
                    ≈ {mm} <span className="text-[20px]">мин</span>
                  </>
                ) : (
                  <span className="text-[26px]">меньше минуты</span>
                )}
                <span className="ml-2 font-sans text-[13px] text-ink-muted">осталось</span>
              </div>
            )}
            <div className="mb-5 text-[13px] text-ink-muted">
              {arrived ? "Встречайте медсестру" : "Прибытие к 14:30 · Пресненская наб., 12"}
            </div>

            {/* стилизованная схема маршрута */}
            <svg viewBox="0 0 340 150" className="w-full" role="img" aria-label="Схема маршрута бригады">
              {/* абстрактные кварталы */}
              <g stroke="rgba(242,239,232,0.06)" strokeWidth={1}>
                <line x1="0" y1="40" x2="340" y2="40" />
                <line x1="0" y1="82" x2="340" y2="82" />
                <line x1="0" y1="118" x2="340" y2="118" />
                <line x1="70" y1="0" x2="70" y2="150" />
                <line x1="160" y1="0" x2="160" y2="150" />
                <line x1="250" y1="0" x2="250" y2="150" />
              </g>

              {/* маршрут: пройденный и оставшийся */}
              <path
                ref={pathRef}
                d="M28 120 C 90 118, 96 70, 150 66 S 240 60, 306 34"
                fill="none"
                stroke="rgba(201,168,106,0.22)"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <path
                d="M28 120 C 90 118, 96 70, 150 66 S 240 60, 306 34"
                fill="none"
                stroke="#C9A86A"
                strokeWidth={3}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - Math.min(1, Math.max(0, progress))}
              />

              {/* старт (клиника) */}
              <circle cx="28" cy="120" r="4" fill="#6E7C73" stroke="#13241D" strokeWidth={2} />
              <text x="28" y="140" textAnchor="middle" fontSize="9" fill="#6E7C73">
                выезд
              </text>

              {/* точка бригады */}
              {dot && (
                <>
                  <circle cx={dot.x} cy={dot.y} r="11" fill="#C9A86A" opacity={0.16} />
                  <circle cx={dot.x} cy={dot.y} r="5.5" fill="#E3C78D" stroke="#13241D" strokeWidth={2} />
                </>
              )}

              {/* адрес клиента */}
              <circle cx="306" cy="34" r="5" fill="#C9A86A" stroke="#13241D" strokeWidth={2} />
              <text x="306" y="20" textAnchor="middle" fontSize="9" fill="#A8B5AD">
                вы
              </text>
            </svg>
          </PCard>

          {/* статусы */}
          <PCard>
            <CardHead title="Статус визита" />
            {STEPS.map((s, i) => {
              const done = i < currentStep || (arrived && i === 3);
              const active = i === currentStep && !arrived;
              return (
                <div key={s.key} className="flex gap-3.5 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-[11px]",
                        done
                          ? "border-gold bg-gold text-bg"
                          : active
                            ? "border-gold text-gold"
                            : "border-line-soft text-ink-dim",
                      )}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    {i < STEPS.length - 1 && (
                      <span
                        className={cn(
                          "mt-1 w-px flex-grow",
                          done ? "bg-gold/40" : "bg-line-soft",
                        )}
                        style={{ minHeight: 18 }}
                      />
                    )}
                  </div>
                  <div className="pb-1">
                    <h4
                      className={cn(
                        "text-[14px]",
                        done || active ? "font-medium text-ink" : "text-ink-dim",
                      )}
                    >
                      {s.label}
                    </h4>
                    <p className="text-[12.5px] text-ink-dim">{s.hint}</p>
                  </div>
                </div>
              );
            })}
          </PCard>
        </div>

        <div>
          <PCard>
            <Eyebrow className="mb-3.5">Ваша медсестра</Eyebrow>
            <div className="flex items-center gap-3.5">
              <div className="flex h-[54px] w-[54px] flex-shrink-0 items-center justify-center rounded-full border border-line bg-gradient-to-br from-[#2a4a3c] to-[#1a2e24] text-xl">
                👩‍⚕️
              </div>
              <div className="flex-grow">
                <h4 className="text-[14px] font-medium text-ink">Ольга К.</h4>
                <p className="text-[12.5px] text-ink-dim">ваш постоянный специалист · 4.9★</p>
              </div>
            </div>
            <button
              onClick={() => toast.show("Демо: звонок медсестре")}
              className="mt-4 w-full rounded-full border border-line py-3 text-[14px] text-ink transition-colors hover:border-gold"
            >
              Позвонить
            </button>
          </PCard>

          <PCard>
            <CardHead title="Визит" />
            <div className="space-y-2.5 text-[13px]">
              <Line k="Программа" v="Энергия+" />
              <Line k="Время" v="14:30" />
              <Line k="Адрес" v="Пресненская наб., 12" />
              <Line k="Длительность" v="45–60 мин" />
            </div>
            <div className="mt-4">
              <StatusBadge status="assigned">бригада назначена</StatusBadge>
            </div>
          </PCard>

          <PCard>
            <CardHead title="Подготовка" />
            {["Выпейте 1–2 стакана воды", "Освободите руку, удобная одежда", "Найдите розетку рядом"].map(
              (t) => (
                <div key={t} className="flex items-center gap-3 py-2">
                  <span className="text-gold">✓</span>
                  <p className="text-[13.5px] text-ink-muted">{t}</p>
                </div>
              ),
            )}
          </PCard>

          <Link
            href="/portal/visits"
            className="block text-center text-[13px] text-ink-dim transition-colors hover:text-gold"
          >
            ← Все мои визиты
          </Link>
        </div>
      </div>
    </>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-muted">{k}</span>
      <span className="text-ink">{v}</span>
    </div>
  );
}
