import { getSmsSender } from "@/lib/modules/auth/sms";

/**
 * Модуль уведомлений: один вызов notify() → нужные каналы.
 *
 * Каналы: SMS (через уже существующую абстракцию провайдера), push и email — стабы
 * до подключения инфраструктуры. Каналы, которые не настроены, мягко пропускаются:
 * уведомление никогда не роняет основной сценарий (запись, подтверждение анализов).
 *
 * 152-ФЗ: в текст уведомления НЕ кладём медицинские подробности (значения показателей,
 * диагнозы) — только факт события и приглашение открыть ЛК.
 */

export type NotificationChannel = "push" | "sms" | "email";

export type NotificationEvent =
  | "visit_confirmed"
  | "brigade_departed"
  | "visit_reminder"
  | "analysis_approved"
  | "rebook_reminder"
  | "promo";

/** Настройки из профиля клиента. */
export type NotificationPrefs = {
  visitStatusPush: boolean;
  smsReminders: boolean;
  rebookReminders: boolean;
  promos: boolean;
};

export const DEFAULT_PREFS: NotificationPrefs = {
  visitStatusPush: true,
  smsReminders: true,
  rebookReminders: true,
  promos: false,
};

/** Какие каналы уместны для события по умолчанию. */
const EVENT_CHANNELS: Record<NotificationEvent, NotificationChannel[]> = {
  visit_confirmed: ["push", "sms"],
  brigade_departed: ["push", "sms"],
  visit_reminder: ["push", "sms"],
  analysis_approved: ["push"],
  rebook_reminder: ["push", "email"],
  promo: ["push", "email"],
};

/** Разрешает ли пользователь этот канал для этого события. */
function allowed(event: NotificationEvent, channel: NotificationChannel, p: NotificationPrefs): boolean {
  if (event === "promo" && !p.promos) return false;
  if (event === "rebook_reminder" && !p.rebookReminders) return false;
  if (channel === "push" && !p.visitStatusPush) return false;
  if (channel === "sms" && !p.smsReminders) return false;
  return true;
}

export type NotifyInput = {
  event: NotificationEvent;
  /** Телефон получателя (для SMS). */
  phone?: string;
  title: string;
  body: string;
  prefs?: NotificationPrefs;
  /** Переопределить каналы (иначе — по событию). */
  channels?: NotificationChannel[];
};

export type NotifyResult = {
  sent: NotificationChannel[];
  skipped: { channel: NotificationChannel; reason: string }[];
};

/** Отправляет уведомление по разрешённым каналам. Никогда не бросает наружу. */
export async function notify(input: NotifyInput): Promise<NotifyResult> {
  const prefs = input.prefs ?? DEFAULT_PREFS;
  const channels = input.channels ?? EVENT_CHANNELS[input.event];
  const sent: NotificationChannel[] = [];
  const skipped: NotifyResult["skipped"] = [];

  for (const channel of channels) {
    if (!allowed(input.event, channel, prefs)) {
      skipped.push({ channel, reason: "отключено в настройках" });
      continue;
    }
    try {
      if (channel === "sms") {
        if (!input.phone) {
          skipped.push({ channel, reason: "нет телефона" });
          continue;
        }
        await getSmsSender().send(input.phone, `VENA: ${input.body}`);
        sent.push("sms");
      } else if (channel === "push") {
        // TODO: web-push / мобильный push после подключения инфраструктуры.
        console.info("[notify:push]", input.event, input.title);
        sent.push("push");
      } else {
        // TODO: почтовый провайдер (российский) после подключения.
        console.info("[notify:email]", input.event, input.title);
        sent.push("email");
      }
    } catch (e) {
      console.error(`[notify] канал ${channel} недоступен:`, e);
      skipped.push({ channel, reason: "ошибка канала" });
    }
  }

  return { sent, skipped };
}
