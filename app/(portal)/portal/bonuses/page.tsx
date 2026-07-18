"use client";

import { useToast } from "@/components/ui/Toast";
import { PCard, CardHead, Row, ScreenHeader, Eyebrow, PLink, StatusBadge } from "@/components/portal/ui";

export default function BonusesPage() {
  const toast = useToast();

  return (
    <>
      <ScreenHeader title="Бонусы" accent="и приглашения" />
      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <div>
          <PCard>
            <Eyebrow className="mb-3">Накоплено</Eyebrow>
            <div className="mb-1 font-display text-[38px] text-gold-light">3 400 ₽</div>
            <div className="mb-[18px] text-[13px] text-ink-muted">
              оплачивайте до 30% визита бонусами
            </div>
            <div className="flex items-center gap-2.5 rounded-[10px] border border-dashed border-line bg-bg-2 px-4 py-3">
              <code className="flex-grow font-display text-[18px] text-gold-light">ALEX-VENA</code>
              <PLink onClick={() => toast.show("Промокод скопирован")}>копировать</PLink>
            </div>
            <p className="mt-4 text-[13px] font-light text-ink-muted">
              Пригласите друга — вы оба получите{" "}
              <b className="text-gold-light">2 000 ₽</b>.
            </p>
          </PCard>
        </div>
        <div>
          <PCard className="text-center">
            <div className="mb-2.5 text-[30px]">🎁</div>
            <h3 className="mb-2 text-[18px] font-normal text-ink">Подарочный сертификат</h3>
            <p className="mb-[18px] text-[13px] font-light text-ink-muted">
              Курс или визит в подарок близким.
            </p>
            <button
              onClick={() => toast.show("Демо: оформление сертификата")}
              className="rounded-full border border-line px-5 py-3 text-[14px] text-ink transition-colors hover:border-gold"
            >
              Подарить визит
            </button>
          </PCard>
          <PCard>
            <CardHead title="Ваш статус" />
            <Row className="border-none p-0">
              <StatusBadge status="confirmed">Gold-клиент</StatusBadge>
              <div className="ml-2 flex-grow">
                <p className="text-[13px] text-ink-muted">Приоритетная запись и спецусловия</p>
              </div>
            </Row>
          </PCard>
        </div>
      </div>
    </>
  );
}
