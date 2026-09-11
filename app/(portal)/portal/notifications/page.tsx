"use client";

import Link from "next/link";
import { useState } from "react";
import { PCard, ScreenHeader, PLink, EmptyState } from "@/components/portal/ui";
import { usePortalState } from "@/components/portal/PortalState";
import {
  FEED_GROUPS,
  NOTIFICATIONS,
  NOTIFICATION_ICONS,
  unreadCount,
  type FeedItem,
} from "@/lib/content/notifications";
import { cn } from "@/lib/utils/cn";

export default function NotificationsPage() {
  const { state } = usePortalState();
  const [items, setItems] = useState<FeedItem[]>(NOTIFICATIONS);
  const unread = unreadCount(items);

  if (state === "new") {
    return (
      <>
        <ScreenHeader title="Уведомления" />
        <PCard>
          <EmptyState
            icon="✦"
            title="Уведомлений пока нет"
            text="Здесь появятся статусы визитов, результаты проверки анализов и напоминания о записи."
          />
        </PCard>
      </>
    );
  }

  return (
    <>
      <ScreenHeader
        title="Уведомления"
        subtitle="Статусы визитов, проверка анализов и напоминания."
      />

      <PCard>
        <div className="mb-5 flex items-center justify-between">
          <span className="text-[13px] text-ink-muted">
            {unread > 0 ? `Непрочитанных: ${unread}` : "Все прочитаны"}
          </span>
          {unread > 0 && (
            <PLink onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}>
              Прочитать все
            </PLink>
          )}
        </div>

        {FEED_GROUPS.map((group) => {
          const groupItems = items.filter((n) => n.group === group);
          if (groupItems.length === 0) return null;
          return (
            <div key={group} className="mb-5 last:mb-0">
              <div className="mb-2 text-[11px] uppercase tracking-[0.13em] text-ink-dim">{group}</div>
              {groupItems.map((n) => {
                const content = (
                  <div
                    className={cn(
                      "flex gap-3.5 rounded-xl border p-3.5 transition-colors",
                      n.read
                        ? "border-line-soft bg-transparent"
                        : "border-gold/30 bg-[rgba(201,168,106,0.05)]",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[15px]",
                        n.read ? "bg-white/5 text-ink-muted" : "bg-[rgba(201,168,106,0.15)] text-gold",
                      )}
                    >
                      {NOTIFICATION_ICONS[n.event]}
                    </div>
                    <div className="min-w-0 flex-grow">
                      <div className="flex items-baseline justify-between gap-3">
                        <h4
                          className={cn(
                            "text-[14px]",
                            n.read ? "font-normal text-ink-muted" : "font-medium text-ink",
                          )}
                        >
                          {n.title}
                        </h4>
                        <span className="flex-shrink-0 text-[11.5px] text-ink-dim">{n.when}</span>
                      </div>
                      <p className="mt-0.5 text-[12.5px] font-light leading-relaxed text-ink-muted">
                        {n.body}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-gold" aria-label="непрочитано" />
                    )}
                  </div>
                );

                return (
                  <div key={n.id} className="mb-2 last:mb-0">
                    {n.href ? (
                      <Link
                        href={n.href}
                        onClick={() =>
                          setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
                        }
                      >
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </PCard>

      <p className="text-[12px] italic text-ink-dim">
        Каналы уведомлений (пуш, SMS, e-mail) настраиваются в{" "}
        <Link href="/portal/profile" className="text-gold hover:opacity-70">
          профиле
        </Link>
        . В тексте уведомлений не передаются медицинские подробности.
      </p>
    </>
  );
}
