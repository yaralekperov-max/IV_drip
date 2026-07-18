"use client";

import Link from "next/link";
import { Topbar, DatePill, Kpi, Panel, PanelHead, AdminBadge, AdminLink } from "@/components/admin/ui";
import type { AdminStatus } from "@/components/admin/ui";

const SCHEDULE: { time: string; title: string; sub: string; status: AdminStatus; label: string }[] = [
  { time: "09:00", title: "Энергия+ · Александр М.", sub: "Пресненский · медсестра Ольга", status: "done", label: "выполнен" },
  { time: "12:00", title: "Иммунитет · Елена В.", sub: "Хамовники · медсестра Ирина", status: "assigned", label: "в пути" },
  { time: "14:30", title: "Энергия+ · Александр М.", sub: "Пресненский · медсестра Ольга", status: "confirmed", label: "подтверждён" },
  { time: "17:00", title: "Красота · Марина К.", sub: "Арбат · медсестра не назначена", status: "new", label: "нужна бригада" },
  { time: "19:30", title: "Детокс · Сергей П.", sub: "Тверской · медсестра Анна", status: "confirmed", label: "подтверждён" },
];

const FEED: { dot: string; text: string; when: string }[] = [
  { dot: "bg-status-pos", text: "Визит выполнен — Александр М.", when: "10 минут назад" },
  { dot: "bg-gold", text: "Новые анализы на проверку — Александр М.", when: "25 минут назад" },
  { dot: "bg-status-info", text: "Новая заявка с лендинга — Марина К.", when: "1 час назад" },
  { dot: "bg-gold", text: "Оформлен абонемент — Сергей П.", when: "2 часа назад" },
  { dot: "bg-status-pos", text: "Курс завершён — Ольга Н. (4/4)", when: "вчера" },
];

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Сводка" accent="за июнь" actions={<DatePill>📅 Сегодня · 21 июня</DatePill>} />

      <div className="mb-7 grid grid-cols-2 gap-[18px] xl:grid-cols-4">
        <Kpi label="Выручка за месяц" value="2,94 млн ₽" delta="↑ 18% к маю" />
        <Kpi label="Визитов выполнено" value="163" delta="↑ 22 за неделю" />
        <Kpi label="Загрузка бригад" value="71%" delta="↑ 6%" />
        <Kpi label="Активных курсов" value="38" delta="↑ 5" />
      </div>

      <div className="grid gap-[18px] lg:grid-cols-[1.5fr_1fr]">
        <Panel>
          <PanelHead
            title="Расписание на сегодня"
            action={
              <Link href="/admin/requests">
                <AdminLink>Все заявки →</AdminLink>
              </Link>
            }
          />
          {SCHEDULE.map((s, i) => (
            <div key={i} className="flex items-center gap-3.5 border-b border-line-soft py-3 last:border-none">
              <div className="w-12 flex-shrink-0 font-display text-[15px] text-gold-light">{s.time}</div>
              <div className="flex-grow">
                <h4 className="text-[13.5px] font-medium text-ink">{s.title}</h4>
                <p className="text-[12px] text-ink-dim">{s.sub}</p>
              </div>
              <AdminBadge status={s.status}>{s.label}</AdminBadge>
            </div>
          ))}
        </Panel>

        <Panel>
          <PanelHead title="Активность" />
          {FEED.map((f, i) => (
            <div key={i} className="flex gap-3 border-b border-line-soft py-3 last:border-none">
              <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${f.dot}`} />
              <div>
                <p className="text-[13px] text-ink">{f.text}</p>
                <span className="text-[11.5px] text-ink-dim">{f.when}</span>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
}
