"use client";

import { useToast } from "@/components/ui/Toast";
import {
  PCard,
  CardHead,
  Row,
  ScreenHeader,
  Eyebrow,
  PLink,
  StatusBadge,
} from "@/components/portal/ui";
import {
  BONUS_BALANCE_RUB,
  BONUS_MAX_SHARE,
  REFERRAL_CODE,
  REFERRAL_LABELS,
  REFERRAL_REWARD_RUB,
  REFERRALS,
  referralEarned,
} from "@/lib/content/loyalty";
import { formatRub } from "@/lib/content/pricing";

export default function BonusesPage() {
  const toast = useToast();
  const earned = referralEarned();
  const inviteLink = `https://vena.ru/?ref=${REFERRAL_CODE}`;

  async function copy(text: string, message: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.show(message);
    } catch {
      toast.show("Не удалось скопировать — выделите и скопируйте вручную");
    }
  }

  return (
    <>
      <ScreenHeader title="Бонусы" accent="и приглашения" />
      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <div>
          <PCard>
            <Eyebrow className="mb-3">Накоплено</Eyebrow>
            <div className="mb-1 font-display text-[38px] text-gold-light">
              {formatRub(BONUS_BALANCE_RUB)}
            </div>
            <div className="mb-[18px] text-[13px] text-ink-muted">
              оплачивайте до {Math.round(BONUS_MAX_SHARE * 100)}% визита бонусами
            </div>
            <div className="flex items-center gap-2.5 rounded-[10px] border border-dashed border-line bg-bg-2 px-4 py-3">
              <code className="flex-grow font-display text-[18px] text-gold-light">
                {REFERRAL_CODE}
              </code>
              <PLink onClick={() => copy(REFERRAL_CODE, "Промокод скопирован")}>копировать</PLink>
            </div>
            <p className="mt-4 text-[13px] font-light text-ink-muted">
              Пригласите друга — вы оба получите{" "}
              <b className="text-gold-light">{formatRub(REFERRAL_REWARD_RUB)}</b> после его первого
              визита.
            </p>
            <button
              onClick={() => copy(inviteLink, "Ссылка-приглашение скопирована")}
              className="mt-4 w-full rounded-full bg-gold py-3 text-[14px] font-medium text-bg transition-colors hover:bg-gold-light"
            >
              Скопировать ссылку-приглашение
            </button>
          </PCard>

          <PCard>
            <CardHead
              title="Приглашённые"
              action={
                <span className="text-[12.5px] text-ink-muted">
                  начислено <b className="text-gold-light">{formatRub(earned)}</b>
                </span>
              }
            />
            {REFERRALS.map((r) => (
              <Row key={r.id}>
                <div className="flex-grow">
                  <h4 className="text-[14px] font-medium text-ink">{r.name}</h4>
                  <p className="text-[12.5px] text-ink-dim">{r.date}</p>
                </div>
                <StatusBadge
                  status={
                    r.status === "visited" ? "done" : r.status === "registered" ? "confirmed" : "pending"
                  }
                >
                  {REFERRAL_LABELS[r.status]}
                </StatusBadge>
                <div className="w-[76px] text-right font-display text-[15px]">
                  {r.rewardRub > 0 ? (
                    <span className="text-status-pos">+{r.rewardRub.toLocaleString("ru-RU")}</span>
                  ) : (
                    <span className="text-ink-dim">—</span>
                  )}
                </div>
              </Row>
            ))}
            <p className="mt-3.5 text-[12px] italic text-ink-dim">
              Бонус начисляется обоим после первого оплаченного визита приглашённого.
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
