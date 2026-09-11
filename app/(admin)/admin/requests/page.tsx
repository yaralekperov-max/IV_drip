"use client";

import { Topbar, DatePill, Panel, AdminBadge, SmallButton } from "@/components/admin/ui";
import type { AdminStatus } from "@/components/admin/ui";
import { useToast } from "@/components/ui/Toast";

type Req = {
  name: string;
  contact: string;
  program: string;
  when: string;
  district: string;
  status: AdminStatus;
  label: string;
  brigade: string;
  assign?: boolean;
};

const ROWS: Req[] = [
  { name: "Марина К.", contact: "+7 916 •••• 34", program: "Красота", when: "21 июня · 17:00", district: "Арбат", status: "new", label: "новая", brigade: "не назначена", assign: true },
  { name: "Сергей П.", contact: "+7 903 •••• 11", program: "Детокс", when: "21 июня · 19:30", district: "Тверской", status: "confirmed", label: "подтверждён", brigade: "Анна Л." },
  { name: "Елена В.", contact: "+7 925 •••• 87", program: "Иммунитет", when: "21 июня · 12:00", district: "Хамовники", status: "assigned", label: "в пути", brigade: "Ирина С." },
  { name: "Александр М.", contact: "Gold · +7 916 •••• 02", program: "Энергия+", when: "21 июня · 14:30", district: "Пресненский", status: "confirmed", label: "подтверждён", brigade: "Ольга К." },
  { name: "Дмитрий Р.", contact: "+7 999 •••• 45", program: "Drip-day (8 чел)", when: "23 июня · 11:00", district: "Москва-Сити", status: "new", label: "новая", brigade: "не назначена", assign: true },
];

export default function RequestsPage() {
  const toast = useToast();

  return (
    <>
      <Topbar
        title="Заявки"
        actions={
          <>
            <input
              placeholder="Поиск по клиенту…"
              className="w-[220px] rounded-[10px] border border-line-soft bg-panel px-4 py-2 text-[13px] text-ink outline-none placeholder:text-ink-dim focus:border-gold"
            />
            <DatePill>Все статусы</DatePill>
          </>
        }
      />
      <Panel className="overflow-x-auto p-0">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Клиент", "Программа", "Дата и время", "Район", "Статус", "Бригада", ""].map((h, i) => (
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
            {ROWS.map((r, i) => (
              <tr key={i} className="transition-colors last:[&>td]:border-none hover:bg-[rgba(201,168,106,0.03)]">
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[13.5px]">
                  <span className="font-medium text-ink">{r.name}</span>
                  <div className="text-[12px] text-ink-dim">{r.contact}</div>
                </td>
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[13.5px] text-ink">{r.program}</td>
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[13.5px] text-ink">{r.when}</td>
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[13.5px] text-ink">{r.district}</td>
                <td className="border-b border-line-soft px-3.5 py-3.5">
                  <AdminBadge status={r.status}>{r.label}</AdminBadge>
                </td>
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[12px] text-ink-dim">{r.brigade}</td>
                <td className="border-b border-line-soft px-3.5 py-3.5">
                  {r.assign ? (
                    <SmallButton gold onClick={() => toast.show("Бригада назначена")}>
                      Назначить
                    </SmallButton>
                  ) : (
                    <SmallButton onClick={() => toast.show("Открыта карточка визита")}>Открыть</SmallButton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
