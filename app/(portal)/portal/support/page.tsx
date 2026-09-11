"use client";

import { useToast } from "@/components/ui/Toast";
import { PCard, CardHead, Row, ScreenHeader, PLink } from "@/components/portal/ui";

const TOPICS = [
  "Вопрос по записи",
  "Перенос/отмена визита",
  "Вопрос по анализам",
  "Оплата и абонемент",
  "Другое",
];

const FAQ = [
  "Как проходит выезд?",
  "Можно ли перенести визит?",
  "Откуда берутся данные анализов?",
  "Как работает абонемент?",
];

export default function SupportPage() {
  const toast = useToast();

  return (
    <>
      <ScreenHeader
        title="Поддержка"
        subtitle="Напишите нам — оператор ответит и при необходимости свяжется по телефону."
      />
      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <div>
          <PCard>
            <CardHead title="Связаться с нами" />
            <div className="mb-[18px]">
              <label className="mb-[7px] block text-[12.5px] text-ink-muted">Тема обращения</label>
              <select className="w-full rounded-[10px] border border-line-soft bg-bg-2 px-4 py-3 text-[14px] text-ink outline-none focus:border-gold">
                {TOPICS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="mb-[18px]">
              <label className="mb-[7px] block text-[12.5px] text-ink-muted">Сообщение</label>
              <input
                placeholder="Опишите ваш вопрос…"
                className="w-full rounded-[10px] border border-line-soft bg-bg-2 px-4 py-3 text-[14px] text-ink outline-none placeholder:text-ink-dim focus:border-gold"
              />
            </div>
            <button
              onClick={() => toast.show("Обращение отправлено — оператор свяжется")}
              className="rounded-full bg-gold px-6 py-3 text-[14px] font-medium text-bg transition-colors hover:bg-gold-light"
            >
              Отправить
            </button>
            <p className="mt-3.5 text-[12px] italic text-ink-dim">
              Обращение фиксируется в вашей карточке — оператор видит историю визитов и быстро
              поможет.
            </p>
          </PCard>
        </div>
        <div>
          <PCard>
            <CardHead title="Частые вопросы" />
            {FAQ.map((q) => (
              <Row key={q}>
                <div className="flex-grow">
                  <h4 className="text-[14px] font-medium text-ink">{q}</h4>
                </div>
                <PLink>→</PLink>
              </Row>
            ))}
          </PCard>
          <PCard>
            <CardHead title="Прямая связь" />
            <Row>
              <div className="flex-grow">
                <h4 className="text-[14px] font-medium text-ink">Телефон</h4>
                <p className="text-[12.5px] text-ink-dim">+7 495 ··· ·· ··</p>
              </div>
            </Row>
            <Row>
              <div className="flex-grow">
                <h4 className="text-[14px] font-medium text-ink">Часы работы</h4>
                <p className="text-[12.5px] text-ink-dim">ежедневно 8:00–22:00</p>
              </div>
            </Row>
          </PCard>
        </div>
      </div>
    </>
  );
}
