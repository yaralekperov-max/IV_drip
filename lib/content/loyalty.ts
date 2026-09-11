/**
 * Абонемент и реферальная программа (моки).
 * После подключения БД — таблицы в операционном контуре + списания через ЮKassa.
 */

export type SubscriptionStatus = "active" | "paused" | "none";

export type Subscription = {
  plan: string;
  status: SubscriptionStatus;
  pricePerMonthRub: number;
  discountPercent: number;
  /** Визитов в месяц по абонементу и сколько уже использовано. */
  visitsIncluded: number;
  visitsUsed: number;
  nextChargeDate: string;
  since: string;
};

export const SUBSCRIPTION: Subscription = {
  plan: "Абонемент «Энергия»",
  status: "active",
  pricePerMonthRub: 42_000,
  discountPercent: 25,
  visitsIncluded: 4,
  visitsUsed: 2,
  nextChargeDate: "20 августа",
  since: "с 14 мая",
};

export type ReferralStatus = "invited" | "registered" | "visited";

export type Referral = {
  id: string;
  name: string;
  status: ReferralStatus;
  /** Начислено, ₽ (0 — пока условие не выполнено). */
  rewardRub: number;
  date: string;
};

export const REFERRAL_CODE = "ALEX-VENA";
/** Сколько получают оба — приглашённый и пригласивший. */
export const REFERRAL_REWARD_RUB = 2_000;

export const REFERRALS: Referral[] = [
  { id: "r1", name: "Дмитрий Р.", status: "visited", rewardRub: 2000, date: "18 июня" },
  { id: "r2", name: "Ольга Н.", status: "visited", rewardRub: 2000, date: "2 июня" },
  { id: "r3", name: "Марина К.", status: "registered", rewardRub: 0, date: "21 июня" },
  { id: "r4", name: "+7 916 ••• 45", status: "invited", rewardRub: 0, date: "22 июня" },
];

/** Подписи статусов — намеренно нейтральные по роду (приглашённые бывают любого пола). */
export const REFERRAL_LABELS: Record<ReferralStatus, string> = {
  invited: "приглашение отправлено",
  registered: "регистрация",
  visited: "визит состоялся",
};

/** Итого начислено по рефералке. */
export function referralEarned(list: Referral[] = REFERRALS): number {
  return list.reduce((sum, r) => sum + r.rewardRub, 0);
}

/** Бонусный баланс клиента (мок). */
export const BONUS_BALANCE_RUB = 3_400;
/** Доля визита, которую можно оплатить бонусами. */
export const BONUS_MAX_SHARE = 0.3;
