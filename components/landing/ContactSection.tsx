"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";

const INTERESTS = ["Разовый визит", "Курс", "Drip-day для компании", "Просто обсудить"];

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          interest: form.get("interest") || undefined,
        }),
      });
    } catch {
      // Заглушка: даже при ошибке сети показываем подтверждение (демо-форма).
    }
    setStatus("done");
  }

  return (
    <section id="contact" className="px-6 py-[130px] sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <div className="mx-auto max-w-[560px] text-center">
            <div className="mb-5 text-[12.5px] uppercase tracking-[0.22em] text-gold">
              Прототип для обсуждения
            </div>
            <h2 className="mx-auto mb-5 font-display text-[clamp(32px,4.4vw,52px)] font-light leading-[1.12] text-ink">
              Оставьте контакт
            </h2>
            <p className="mb-12 text-[17px] font-light text-ink-muted">
              Это рабочий прототип сервиса. Если формат откликается — свяжемся и обсудим детали под
              ваш запрос.
            </p>

            {status === "done" ? (
              <div className="rounded-[20px] border border-gold bg-panel p-12">
                <h4 className="mb-2.5 font-display text-[26px] font-normal text-gold-light">
                  Спасибо
                </h4>
                <p className="font-light text-ink-muted">
                  Это демонстрационная форма прототипа — отправка пока не подключена к CRM.
                </p>
              </div>
            ) : (
              <>
                <form className="grid gap-3.5 text-left" onSubmit={onSubmit}>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Как к вам обращаться"
                    className="w-full rounded-xl border border-line-soft bg-panel px-5 py-4 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-dim focus:border-gold"
                  />
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="Телефон"
                    className="w-full rounded-xl border border-line-soft bg-panel px-5 py-4 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-dim focus:border-gold"
                  />
                  <select
                    name="interest"
                    defaultValue=""
                    className="w-full cursor-pointer rounded-xl border border-line-soft bg-panel px-5 py-4 text-[15px] text-ink-muted outline-none transition-colors focus:border-gold"
                  >
                    <option value="">Что интересует</option>
                    {INTERESTS.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="mt-2 rounded-full bg-gold py-[18px] text-[15px] font-semibold text-bg transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-gold disabled:pointer-events-none disabled:opacity-60"
                  >
                    {status === "sending" ? "Отправляем…" : "Отправить заявку"}
                  </button>
                </form>
                <p className="mt-[18px] text-[12.5px] text-ink-dim">
                  Нажимая «Отправить», вы соглашаетесь на обработку персональных данных.
                </p>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
