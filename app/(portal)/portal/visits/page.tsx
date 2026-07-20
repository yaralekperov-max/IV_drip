"use client";

import Link from "next/link";
import { useState } from "react";
import { usePortalState } from "@/components/portal/PortalState";
import { useToast } from "@/components/ui/Toast";
import {
  PCard,
  CardHead,
  Row,
  ScreenHeader,
  StatusBadge,
  EmptyState,
  PLink,
} from "@/components/portal/ui";

function RowDate({ d, m }: { d: string; m: string }) {
  return (
    <div className="w-[52px] flex-shrink-0 text-center">
      <b className="block font-display text-xl leading-none text-ink">{d}</b>
      <span className="text-[11px] uppercase text-ink-dim">{m}</span>
    </div>
  );
}

export default function VisitsPage() {
  const { state } = usePortalState();
  const toast = useToast();
  const [cancelOpen, setCancelOpen] = useState(false);

  if (state === "new") {
    return (
      <>
        <ScreenHeader title="Мои визиты" />
        <PCard>
          <EmptyState
            icon="◷"
            title="Визитов пока нет"
            text="После первой записи здесь появятся предстоящие и прошедшие визиты со статусами."
            action={
              <Link
                href="/portal/booking"
                className="inline-block rounded-full bg-gold px-7 py-3.5 text-[14px] font-medium text-bg transition-colors hover:bg-gold-light"
              >
                Записаться
              </Link>
            }
          />
        </PCard>
      </>
    );
  }

  return (
    <>
      <ScreenHeader title="Мои визиты" />
      <PCard>
        <CardHead title="Предстоящие" />
        <Row>
          <RowDate d="21" m="июн" />
          <div className="flex-grow">
            <h4 className="text-[14px] font-medium text-ink">Энергия+ · 14:30</h4>
            <p className="text-[12.5px] text-ink-dim">Дома · бригада в пути</p>
          </div>
          <StatusBadge status="assigned">бригада назначена</StatusBadge>
        </Row>
        <Row>
          <RowDate d="23" m="июн" />
          <div className="flex-grow">
            <h4 className="text-[14px] font-medium text-ink">Энергия+ · 12:00</h4>
            <p className="text-[12.5px] text-ink-dim">Офис · ждёт подтверждения оператора</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status="pending">на подтверждении</StatusBadge>
            <div className="flex gap-1.5">
              <PLink onClick={() => toast.show("Запрос на перенос отправлен")}>Перенести</PLink>
              <PLink className="text-status-neg" onClick={() => setCancelOpen(true)}>
                Отменить
              </PLink>
            </div>
          </div>
        </Row>
      </PCard>

      <PCard>
        <CardHead title="История" />
        {[
          { d: "14", m: "июн", t: "Энергия+ · визит 3/4", p: "Дома · Ольга · 60 мин", s: "done" as const, l: "выполнен" },
          { d: "07", m: "июн", t: "Энергия+ · визит 2/4", p: "Офис · Ольга · 55 мин", s: "done" as const, l: "выполнен" },
          { d: "31", m: "мая", t: "Энергия+ · визит 1/4", p: "Дома · Ольга · 60 мин", s: "done" as const, l: "выполнен" },
          { d: "12", m: "мая", t: "Детокс · разовый", p: "Дома · Иванов · отменён клиентом", s: "cancel" as const, l: "отменён" },
        ].map((v, i) => (
          <Row key={i}>
            <RowDate d={v.d} m={v.m} />
            <div className="flex-grow">
              <h4 className="text-[14px] font-medium text-ink">{v.t}</h4>
              <p className="text-[12.5px] text-ink-dim">{v.p}</p>
            </div>
            <StatusBadge status={v.s}>{v.l}</StatusBadge>
          </Row>
        ))}
      </PCard>

      {cancelOpen && (
        <div
          className="fixed inset-0 z-[400] flex items-start justify-center overflow-y-auto bg-[rgba(5,9,7,0.78)] p-5 backdrop-blur-sm sm:py-10"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCancelOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-[560px] rounded-[22px] border border-line bg-panel p-8">
            <button
              onClick={() => setCancelOpen(false)}
              aria-label="Закрыть"
              className="absolute right-[22px] top-5 flex h-9 w-9 items-center justify-center rounded-full border border-line-soft text-lg text-ink"
            >
              ✕
            </button>
            <h3 className="mb-1.5 font-display text-[23px] font-normal text-ink">Отменить визит?</h3>
            <p className="mb-[22px] text-[13px] text-ink-muted">
              Визит 23 июня, 12:00 · Офис. Отмена бесплатна не позднее чем за 4 часа.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setCancelOpen(false);
                  toast.show("Визит отменён, средства вернутся на карту");
                }}
                className="rounded-full bg-gold px-6 py-3 text-[14px] font-medium text-bg transition-colors hover:bg-gold-light"
              >
                Да, отменить
              </button>
              <button
                onClick={() => setCancelOpen(false)}
                className="rounded-full border border-line px-5 py-3 text-[14px] text-ink transition-colors hover:border-gold"
              >
                Оставить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
