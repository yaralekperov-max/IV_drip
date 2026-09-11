"use client";

import { Topbar, DatePill, Panel, PanelHead, AdminBadge } from "@/components/admin/ui";
import type { AdminStatus } from "@/components/admin/ui";

function Nurse({
  name,
  info,
  status,
  label,
}: {
  name: string;
  info: string;
  status: AdminStatus;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3.5 border-b border-line-soft py-3.5 last:border-none">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-line bg-gradient-to-br from-[#2a4a3c] to-[#1a2e24] text-base">
        👩‍⚕️
      </div>
      <div className="flex-grow">
        <h4 className="text-[14px] font-medium text-ink">{name}</h4>
        <p className="text-[12px] text-ink-dim">{info}</p>
      </div>
      <AdminBadge status={status}>{label}</AdminBadge>
    </div>
  );
}

const COVERAGE = [
  { okrug: "Центр", pool: 4, available: 2, planned: 3, reserve: "ок", tone: "active" as AdminStatus },
  { okrug: "Запад", pool: 3, available: 2, planned: 1, reserve: "ок", tone: "active" as AdminStatus },
  { okrug: "Юг", pool: 2, available: 1, planned: 1, reserve: "впритык", tone: "pending" as AdminStatus },
  { okrug: "Север", pool: 2, available: 1, planned: 0, reserve: "ок", tone: "active" as AdminStatus },
];

export default function BrigadesPage() {
  return (
    <>
      <Topbar title="Бригады" accent="на сегодня" actions={<DatePill>5 на смене · 2 дежурных</DatePill>} />

      <div className="grid gap-[18px] lg:grid-cols-2">
        <Panel>
          <PanelHead
            title="Сейчас на выезде"
            action={<span className="text-[11px] uppercase tracking-[0.1em] text-gold">в реальном времени</span>}
          />
          <Nurse name="Ирина С." info="Хамовники · Елена В. · прибытие 12:00" status="busy" label="в пути" />
          <Nurse name="Ольга К." info="Пресненский · следующий визит 14:30" status="active" label="свободна" />
        </Panel>
        <Panel>
          <PanelHead title="Доступны по районам" />
          <Nurse name="Анна Л." info="Центр · Тверской · опыт 6 лет · 4.8★" status="active" label="доступна" />
          <Nurse name="Мария Д." info="Запад · Кунцево · опыт 9 лет · 4.9★" status="active" label="доступна" />
          <Nurse name="Татьяна В." info="Юг · дежурная · опыт 5 лет · 4.7★" status="pending" label="дежурит" />
        </Panel>
      </div>

      <Panel className="overflow-x-auto">
        <PanelHead
          title="Покрытие по округам"
          action={
            <span className="text-[11px] uppercase tracking-[0.1em] text-gold">
              резерв 2× к среднесуточной нагрузке
            </span>
          }
        />
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Округ", "Медсестёр в пуле", "Доступно сегодня", "Визитов запланировано", "Резерв"].map((h) => (
                <th
                  key={h}
                  className="border-b border-line-soft px-3.5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-gold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COVERAGE.map((c) => (
              <tr key={c.okrug} className="last:[&>td]:border-none">
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[13.5px] font-medium text-ink">{c.okrug}</td>
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[13.5px] text-ink">{c.pool}</td>
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[13.5px] text-ink">{c.available}</td>
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[13.5px] text-ink">{c.planned}</td>
                <td className="border-b border-line-soft px-3.5 py-3.5">
                  <AdminBadge status={c.tone}>{c.reserve}</AdminBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
