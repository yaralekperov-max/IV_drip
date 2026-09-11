"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PCard, ScreenHeader, StatusBadge } from "@/components/portal/ui";
import { cn } from "@/lib/utils/cn";
import { PRICING, formatRub } from "@/lib/content/pricing";

const STEPS = [
  { key: "prog", label: "Программа", options: ["⚡ Энергия+", "🌿 Детокс", "🛡️ Иммунитет", "✨ Красота", "🧠 Ясность", "🩺 По анализам"] },
  { key: "date", label: "Дата", options: ["Сегодня", "Завтра", "23 июня", "24 июня"] },
  { key: "time", label: "Желаемое время", options: ["09:00", "12:00", "14:30", "17:00", "19:30"] },
  { key: "addr", label: "Адрес выезда", options: ["🏠 Дом", "🏢 Офис", "＋ Новый адрес"] },
  { key: "pay", label: "Оплата", options: ["Онлайн картой", "При визите", "Бонусами (−3 400 ₽)"] },
] as const;

type Key = (typeof STEPS)[number]["key"];

export default function BookingPage() {
  const router = useRouter();
  const [sel, setSel] = useState<Partial<Record<Key, string>>>({});
  const [modal, setModal] = useState<"consent" | "sent" | null>(null);
  const [consent1, setConsent1] = useState(true);
  const [consent2, setConsent2] = useState(true);
  const [sending, setSending] = useState(false);

  const complete = STEPS.every((s) => sel[s.key]);

  async function sendBooking() {
    setSending(true);
    try {
      await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          program: sel.prog,
          date: sel.date,
          time: sel.time,
          address: sel.addr,
          payment: sel.pay,
          priceRub: PRICING.single,
        }),
      });
    } catch {
      // Демо: не блокируем подтверждение из-за сети.
    } finally {
      setSending(false);
      setModal("sent");
    }
  }

  return (
    <>
      <ScreenHeader
        title="Записаться"
        accent="на визит"
        subtitle="Выберите программу, желаемое время и адрес. Оператор подтвердит слот после проверки доступности бригады."
      />
      <PCard>
        {STEPS.map((step) => (
          <div key={step.key}>
            <div className="mb-3 mt-5 text-[11px] uppercase tracking-[0.12em] text-gold first:mt-0">
              {step.label}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {step.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSel((s) => ({ ...s, [step.key]: opt }))}
                  className={cn(
                    "rounded-full border px-[18px] py-2.5 text-[13.5px] transition-all",
                    sel[step.key] === opt
                      ? "border-gold bg-[rgba(201,168,106,0.12)] text-ink"
                      : "border-line-soft text-ink-muted hover:border-gold",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        {complete && (
          <div className="mt-[18px] rounded-xl border border-line-soft bg-bg-2 p-4 text-[13.5px] text-ink-muted">
            <b className="text-ink">{sel.prog}</b> · {sel.date}, {sel.time}
            <br />
            {sel.addr}
            <br />
            Оплата: {sel.pay} · <b className="text-ink">{formatRub(PRICING.single)}</b>
          </div>
        )}

        <button
          disabled={!complete}
          onClick={() => setModal("consent")}
          className="mt-[22px] w-full rounded-full bg-gold py-3.5 text-[14px] font-medium text-bg transition-colors hover:bg-gold-light disabled:pointer-events-none disabled:opacity-40"
        >
          {complete ? "Продолжить к согласию" : "Выберите все пункты"}
        </button>
      </PCard>

      {modal && (
        <div
          className="fixed inset-0 z-[400] flex items-start justify-center overflow-y-auto bg-[rgba(5,9,7,0.78)] p-5 backdrop-blur-sm sm:py-10"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-[560px] rounded-[22px] border border-line bg-panel p-8">
            {modal === "consent" ? (
              <>
                <button
                  onClick={() => setModal(null)}
                  aria-label="Закрыть"
                  className="absolute right-[22px] top-5 flex h-9 w-9 items-center justify-center rounded-full border border-line-soft text-lg text-ink"
                >
                  ✕
                </button>
                <h3 className="mb-1.5 font-display text-[23px] font-normal text-ink">
                  Согласие на процедуру
                </h3>
                <p className="mb-[22px] text-[13px] text-ink-muted">
                  Перед визитом подтвердите информированное согласие — это требование для медицинской
                  процедуры.
                </p>
                <Consent checked={consent1} onToggle={() => setConsent1((v) => !v)}>
                  Я ознакомлен с <b className="font-medium text-ink">показаниями и
                  противопоказаниями</b> и даю <a className="text-gold">информированное согласие</a> на
                  проведение IV-терапии
                </Consent>
                <Consent checked={consent2} onToggle={() => setConsent2((v) => !v)}>
                  Подтверждаю, что предоставленные сведения о здоровье{" "}
                  <b className="font-medium text-ink">достоверны</b>
                </Consent>
                <div className="mt-4 rounded-xl border border-line-soft bg-bg-2 p-4 text-[13.5px] text-ink-muted">
                  <b className="text-ink">{sel.prog}</b> · {sel.date}, {sel.time} · {sel.addr}
                  <br />
                  Желаемый слот — оператор подтвердит доступность бригады
                </div>
                <button
                  disabled={!consent1 || !consent2 || sending}
                  onClick={sendBooking}
                  className="mt-5 w-full rounded-full bg-gold py-3.5 text-[14px] font-medium text-bg transition-colors hover:bg-gold-light disabled:pointer-events-none disabled:opacity-40"
                >
                  {sending ? "Отправляем…" : "Отправить заявку"}
                </button>
              </>
            ) : (
              <div className="py-5 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(217,180,112,0.15)] text-[30px] text-status-warn">
                  🕓
                </div>
                <h3 className="font-display text-[23px] font-normal text-ink">Заявка отправлена</h3>
                <p className="mx-auto mt-2.5 max-w-[380px] text-[14px] font-light text-ink-muted">
                  Оператор проверит доступность бригады в выбранном районе и времени, затем подтвердит
                  слот. Статус — в разделе «Мои визиты».
                </p>
                <div className="mt-3.5">
                  <StatusBadge status="pending">на подтверждении</StatusBadge>
                </div>
                <button
                  onClick={() => {
                    setModal(null);
                    router.push("/portal/visits");
                  }}
                  className="mt-6 rounded-full bg-gold px-7 py-3.5 text-[14px] font-medium text-bg transition-colors hover:bg-gold-light"
                >
                  К моим визитам
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Consent({
  checked,
  onToggle,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "mb-3.5 flex cursor-pointer items-start gap-3 rounded-xl border bg-bg-2 p-4 transition-colors",
        checked ? "border-gold" : "border-line-soft hover:border-line",
      )}
    >
      <div
        className={cn(
          "flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-md border text-[13px] text-bg",
          checked ? "border-gold bg-gold" : "border-line",
        )}
      >
        {checked && "✓"}
      </div>
      <div className="text-[13px] font-light leading-relaxed text-ink-muted">{children}</div>
    </div>
  );
}
