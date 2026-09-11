import type { NotificationEvent } from "@/lib/modules/notifications";

/**
 * Лента уведомлений клиента (моки).
 * После подключения БД — таблица уведомлений в операционном контуре.
 *
 * 152-ФЗ: в тексте нет медицинских подробностей — только факт события.
 */

export type FeedItem = {
  id: string;
  event: NotificationEvent;
  title: string;
  body: string;
  /** Человекочитаемое время. */
  when: string;
  /** Группа для разделителя в ленте. */
  group: "Сегодня" | "Вчера" | "Ранее";
  read: boolean;
  /** Куда ведёт уведомление. */
  href?: string;
};

export const NOTIFICATION_ICONS: Record<NotificationEvent, string> = {
  visit_confirmed: "✓",
  brigade_departed: "🚗",
  visit_reminder: "◷",
  analysis_approved: "🩺",
  rebook_reminder: "↻",
  promo: "★",
};

export const NOTIFICATIONS: FeedItem[] = [
  {
    id: "f1",
    event: "brigade_departed",
    title: "Бригада выехала к вам",
    body: "Медсестра Ольга в пути, прибытие к 14:30.",
    when: "13:52",
    group: "Сегодня",
    read: false,
    href: "/portal/track",
  },
  {
    id: "f2",
    event: "analysis_approved",
    title: "Врач проверил ваши анализы",
    body: "Показатели добавлены в динамику, есть рекомендация врача.",
    when: "11:20",
    group: "Сегодня",
    read: false,
    href: "/portal/analyses",
  },
  {
    id: "f3",
    event: "visit_confirmed",
    title: "Визит подтверждён",
    body: "21 июня, 14:30 — оператор подтвердил слот.",
    when: "вчера, 18:04",
    group: "Вчера",
    read: true,
    href: "/portal/visits",
  },
  {
    id: "f4",
    event: "rebook_reminder",
    title: "Пора записаться на следующий визит",
    body: "Остался 1 визит из курса «Энергия» — рекомендуем не делать паузу.",
    when: "19 июня",
    group: "Ранее",
    read: true,
    href: "/portal/booking",
  },
  {
    id: "f5",
    event: "promo",
    title: "Начислены бонусы",
    body: "+2 000 ₽ за приглашённого друга — Дмитрий Р. пришёл на визит.",
    when: "18 июня",
    group: "Ранее",
    read: true,
    href: "/portal/bonuses",
  },
];

export const FEED_GROUPS: FeedItem["group"][] = ["Сегодня", "Вчера", "Ранее"];

export function unreadCount(list: FeedItem[] = NOTIFICATIONS): number {
  return list.filter((n) => !n.read).length;
}
