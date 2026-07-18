"use client";

import { useState } from "react";
import { Topbar, DatePill, Panel, AdminBadge, SmallButton } from "@/components/admin/ui";
import { useToast } from "@/components/ui/Toast";
import { useAdminState } from "@/components/admin/AdminState";
import { cn } from "@/lib/utils/cn";

type Analysis = {
  id: string;
  name: string;
  tag: string;
  uploaded: string;
  lab: string;
  count: number;
  confirmed: boolean;
  file: string;
};

const INITIAL: Analysis[] = [
  { id: "a1", name: "Александр М.", tag: "Gold-клиент", uploaded: "25 минут назад", lab: "ИНВИТРО", count: 5, confirmed: false, file: "analiz_invitro_21062026.pdf" },
  { id: "a2", name: "Сергей П.", tag: "Абонемент", uploaded: "2 часа назад", lab: "Гемотест", count: 7, confirmed: false, file: "gemotest_sergey.pdf" },
  { id: "a3", name: "Ольга Н.", tag: "Gold-клиент", uploaded: "вчера", lab: "ИНВИТРО", count: 6, confirmed: true, file: "invitro_olga.pdf" },
];

type Marker = { name: string; unit: string; value: string; status: string };

const RECOGNIZED: Marker[] = [
  { name: "Витамин D, 25-OH", unit: "нг/мл · норма 30–100", value: "52", status: "норма" },
  { name: "Ферритин", unit: "нг/мл · норма 30–400", value: "65", status: "норма" },
  { name: "Витамин B12", unit: "пг/мл · норма 200–900", value: "540", status: "норма" },
  { name: "Гемоглобин", unit: "г/л · норма 130–170", value: "152", status: "норма" },
  { name: "Железо", unit: "мкмоль/л · норма 11–28", value: "18", status: "норма" },
];

export default function AnalysesPage() {
  const toast = useToast();
  const { decAnalysesPending } = useAdminState();
  const [rows, setRows] = useState(INITIAL);
  const [active, setActive] = useState<Analysis | null>(null);

  function confirm(id: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, confirmed: true } : r)));
    decAnalysesPending();
    setActive(null);
    toast.show("Подтверждено — данные в динамике клиента");
  }

  return (
    <>
      <Topbar title="Анализы" accent="на проверке" actions={<DatePill>2 ждут подтверждения</DatePill>} />

      <Panel className="overflow-x-auto p-0">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Клиент", "Загружено", "Лаборатория", "Показателей", "Статус", ""].map((h, i) => (
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
            {rows.map((r) => (
              <tr key={r.id} className="transition-colors last:[&>td]:border-none hover:bg-[rgba(201,168,106,0.03)]">
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[13.5px]">
                  <span className="font-medium text-ink">{r.name}</span>
                  <div className="text-[12px] text-ink-dim">{r.tag}</div>
                </td>
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[13.5px] text-ink">{r.uploaded}</td>
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[13.5px] text-ink">{r.lab}</td>
                <td className="border-b border-line-soft px-3.5 py-3.5 text-[13.5px] text-ink">{r.count}</td>
                <td className="border-b border-line-soft px-3.5 py-3.5">
                  {r.confirmed ? (
                    <AdminBadge status="done">подтверждено</AdminBadge>
                  ) : (
                    <AdminBadge status="pending">ждёт проверки</AdminBadge>
                  )}
                </td>
                <td className="border-b border-line-soft px-3.5 py-3.5">
                  {r.confirmed ? (
                    <SmallButton onClick={() => toast.show("Уже подтверждено")}>Открыть</SmallButton>
                  ) : (
                    <SmallButton gold onClick={() => setActive(r)}>
                      Проверить
                    </SmallButton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <p className="mt-4 text-[12px] italic leading-relaxed text-ink-dim">
        Парсер распознаёт показатели из загруженного клиентом PDF. Врач сверяет значения с
        оригиналом, при необходимости правит, и подтверждает — только после этого данные появляются в
        динамике клиента. Это защищает от ошибок распознавания.
      </p>

      {active && <VerifyModal analysis={active} onClose={() => setActive(null)} onConfirm={confirm} />}
    </>
  );
}

function VerifyModal({
  analysis,
  onClose,
  onConfirm,
}: {
  analysis: Analysis;
  onClose: () => void;
  onConfirm: (id: string) => void;
}) {
  const [values, setValues] = useState<string[]>(RECOGNIZED.map((m) => m.value));

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-[rgba(5,9,7,0.8)] p-5 backdrop-blur-sm sm:py-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-[880px] rounded-[20px] border border-line bg-panel p-8">
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-[22px] top-5 flex h-9 w-9 items-center justify-center rounded-full border border-line-soft text-lg text-ink"
        >
          ✕
        </button>
        <h2 className="mb-1 font-display text-[22px] font-normal text-ink">
          Проверка анализов — {analysis.name}
        </h2>
        <p className="mb-6 text-[13px] text-ink-muted">
          Сверьте распознанные значения с оригиналом PDF. Исправьте, если парсер ошибся, и подтвердите
          — данные уйдут в динамику клиента.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* PDF preview placeholder */}
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-line-soft bg-bg-2 p-6 text-center">
            <div className="mb-3.5 text-[40px] opacity-60">📄</div>
            <p className="text-[13px] text-ink-muted">Оригинал PDF от клиента</p>
            <div className="mt-2 text-[13px] text-gold-light">{analysis.file}</div>
            <p className="mt-3.5 text-[12px] text-ink-dim">(в рабочей версии — просмотр PDF рядом)</p>
          </div>

          {/* recognized values, editable */}
          <div>
            <div className="mb-2 text-[11px] uppercase tracking-[0.1em] text-gold">
              Распознано парсером
            </div>
            {RECOGNIZED.map((m, i) => (
              <div
                key={m.name}
                className="flex items-center gap-3 border-b border-line-soft py-3 last:border-none"
              >
                <div className="flex-grow text-[13.5px] text-ink">
                  {m.name}
                  <span className="block text-[11.5px] text-ink-dim">{m.unit}</span>
                </div>
                <input
                  value={values[i]}
                  onChange={(e) =>
                    setValues((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
                  }
                  className="w-20 rounded-lg border border-line-soft bg-bg-2 px-2.5 py-2 text-center font-display text-[15px] text-ink outline-none focus:border-gold"
                />
                <span className={cn("rounded-full px-2.5 py-[3px] text-[11px]", "bg-[rgba(127,184,138,0.14)] text-status-pos")}>
                  {m.status}
                </span>
              </div>
            ))}
            <div className="mt-6 flex gap-3">
              <SmallButton gold className="flex-1 py-3" onClick={() => onConfirm(analysis.id)}>
                Подтвердить и добавить в динамику
              </SmallButton>
              <SmallButton className="py-3" onClick={onClose}>
                Отмена
              </SmallButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
