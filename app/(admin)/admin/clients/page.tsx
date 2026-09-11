"use client";

import { Topbar, DatePill, Panel, AdminBadge, SmallButton } from "@/components/admin/ui";
import type { AdminStatus } from "@/components/admin/ui";
import { useToast } from "@/components/ui/Toast";

type Client = {
  name: string;
  since: string;
  status: AdminStatus;
  statusLabel: string;
  plan: string;
  last: string;
  total: number;
};

const ROWS: Client[] = [
  { name: "Александр М.", since: "с мая 2026", status: "confirmed", statusLabel: "Gold", plan: "Энергия · 3/4", last: "14 июня", total: 4 },
  { name: "Сергей П.", since: "с апреля 2026", status: "active", statusLabel: "Абонемент", plan: "Абонемент · активен", last: "18 июня", total: 11 },
  { name: "Елена В.", since: "с июня 2026", status: "done", statusLabel: "Новый", plan: "Разовый", last: "сегодня", total: 1 },
  { name: "Марина К.", since: "с июня 2026", status: "done", statusLabel: "Новый", plan: "—", last: "—", total: 0 },
  { name: "Ольга Н.", since: "с марта 2026", status: "confirmed", statusLabel: "Gold", plan: "Красота · 4/4 завершён", last: "16 июня", total: 8 },
];

export default function ClientsPage() {
  const toast = useToast();

  return (
    <>
      <Topbar
        title="Клиенты"
        actions={
          <>
            <input
              placeholder="Поиск…"
              className="w-[220px] rounded-[10px] border border-line-soft bg-panel px-4 py-2 text-[13px] text-ink outline-none placeholder:text-ink-dim focus:border-gold"
            />
            <DatePill>Всего 124</DatePill>
          </>
        }
      />
      <Panel className="overflow-x-auto p-0">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Клиент", "Статус", "Курс / абонемент", "Последний визит", "Визитов всего", ""].map((h, i) => (
                <th
                  key={i}
                  className="border-b border-line-soft px-3.5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-gold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((c, i) => (
              <tr key={i} className="transition-colors last:[&>td]:border-none hover:bg-[rgba(201,168,106,0.03)]">
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[13.5px]">
                  <span className="font-medium text-ink">{c.name}</span>
                  <div className="text-[12px] text-ink-dim">{c.since}</div>
                </td>
                <td className="border-b border-line-soft px-3.5 py-3.5">
                  <AdminBadge status={c.status}>{c.statusLabel}</AdminBadge>
                </td>
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[13.5px] text-ink">{c.plan}</td>
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[13.5px] text-ink">{c.last}</td>
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[13.5px] text-ink">{c.total}</td>
                <td className="border-b border-line-soft px-3.5 py-3.5">
                  <SmallButton onClick={() => toast.show("Карточка клиента")}>Открыть</SmallButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
