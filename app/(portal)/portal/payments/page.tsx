"use client";

import { usePortalState } from "@/components/portal/PortalState";
import { useToast } from "@/components/ui/Toast";
import { PCard, CardHead, Row, ScreenHeader, EmptyState, PLink } from "@/components/portal/ui";

export default function PaymentsPage() {
  const { state } = usePortalState();
  const toast = useToast();

  async function paySubscription() {
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountRub: 42000, description: "Абонемент VENA — 4 визита/мес" }),
      });
      const data = await res.json();
      if (data.ok && data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
        return;
      }
      if (res.status === 503) {
        toast.show("Онлайн-оплата подключается (ЮKassa ещё не настроена)");
        return;
      }
      toast.show("Не удалось создать платёж");
    } catch {
      toast.show("Ошибка сети");
    }
  }

  if (state === "new") {
    return (
      <>
        <ScreenHeader title="Платежи" />
        <PCard>
          <EmptyState
            icon="₽"
            title="Платежей пока нет"
            text="История оплат, чеки и управление абонементом появятся после первого визита."
          />
        </PCard>
      </>
    );
  }

  return (
    <>
      <ScreenHeader title="Платежи" />
      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <div>
          <PCard>
            <CardHead title="История платежей" />
            <Row>
              <div className="flex-grow">
                <h4 className="text-[14px] font-medium text-ink">Курс «Энергия» (4 визита)</h4>
                <p className="text-[12.5px] text-ink-dim">14 мая · картой ···· 4432</p>
              </div>
              <div className="font-display text-base text-ink">56 000 ₽</div>
            </Row>
            <Row>
              <div className="flex-grow">
                <h4 className="text-[14px] font-medium text-ink">Капельница «Детокс»</h4>
                <p className="text-[12.5px] text-ink-dim">12 мая · картой ···· 4432</p>
              </div>
              <div className="font-display text-base text-ink">18 000 ₽</div>
            </Row>
            <Row>
              <div className="flex-grow">
                <h4 className="text-[14px] font-medium text-ink">Возврат — отменённый визит</h4>
                <p className="text-[12.5px] text-ink-dim">12 мая</p>
              </div>
              <div className="font-display text-base text-status-pos">+18 000 ₽</div>
            </Row>
          </PCard>
        </div>
        <div>
          <PCard className="border-gold bg-gradient-to-br from-[#1a3329] to-[#0F1B16]">
            <div className="mb-2 text-[11px] uppercase tracking-[0.13em] text-gold">Абонемент</div>
            <div className="font-display text-[28px] text-gold-light">
              42 000 ₽<span className="font-sans text-[13px] text-ink-muted"> / мес</span>
            </div>
            <div className="mb-[18px] text-[12.5px] text-ink-muted">
              −25% · 4 визита/мес · приоритет
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={paySubscription}
                className="rounded-full bg-gold px-6 py-3 text-[14px] font-medium text-bg transition-colors hover:bg-gold-light"
              >
                Оформить
              </button>
              <button
                onClick={() => toast.show("Демо: пауза абонемента")}
                className="rounded-full border border-line px-4 py-2.5 text-[12.5px] text-ink transition-colors hover:border-gold"
              >
                Пауза
              </button>
            </div>
          </PCard>
          <PCard>
            <CardHead title="Чеки" />
            <Row>
              <div className="flex-grow">
                <h4 className="text-[14px] font-medium text-ink">Чек №2241 — курс</h4>
                <p className="text-[12.5px] text-ink-dim">14 мая</p>
              </div>
              <PLink onClick={() => toast.show("Демо: скачивание чека")}>Скачать</PLink>
            </Row>
            <Row>
              <div className="flex-grow">
                <h4 className="text-[14px] font-medium text-ink">Чек №2198 — детокс</h4>
                <p className="text-[12.5px] text-ink-dim">12 мая</p>
              </div>
              <PLink onClick={() => toast.show("Демо: скачивание чека")}>Скачать</PLink>
            </Row>
          </PCard>
        </div>
      </div>
    </>
  );
}
