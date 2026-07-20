"use client";

import { useRef, useState } from "react";
import { Topbar, Panel, PanelHead, SmallButton } from "@/components/admin/ui";
import { useToast } from "@/components/ui/Toast";

type ImportReport = {
  format: string;
  total: number;
  valid?: { code: string; name: string; unit?: string; category?: string }[];
  errors: { row: number; message: string }[];
};

export default function BiomarkersPage() {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [busy, setBusy] = useState(false);

  async function send(dryRun: boolean) {
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/admin/biomarkers/import${dryRun ? "?dryRun=1" : ""}`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.report) setReport(data.report as ImportReport);
      if (!res.ok || !data.ok) {
        if (data.error === "no_database") {
          toast.show("Разобрано, но БД не подключена — запись пропущена");
        } else {
          toast.show("Не удалось импортировать файл");
        }
        return;
      }
      if (dryRun) toast.show(`Предпросмотр: распознано ${data.report.valid?.length ?? 0}`);
      else toast.show(`Импортировано: ${data.imported}`);
    } catch {
      toast.show("Ошибка сети");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Topbar title="Справочник" accent="биомаркеров" />

      <Panel>
        <PanelHead title="Загрузка списка" />
        <p className="mb-4 text-[13px] font-light leading-relaxed text-ink-muted">
          Поддерживаются <b className="text-ink">CSV, TSV и JSON</b>. Колонки распознаются гибко
          (рус./англ.): название, единицы, категория, норма, синонимы. Код (`code`) можно не
          указывать — он сгенерируется из названия. Повторная загрузка обновляет записи по коду.
          Excel — сохраните лист как CSV.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.tsv,.json,text/csv,application/json"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setReport(null);
            }}
            className="text-[13px] text-ink-muted file:mr-3 file:rounded-lg file:border file:border-line file:bg-transparent file:px-4 file:py-2 file:text-[13px] file:text-ink hover:file:border-gold"
          />
          <SmallButton disabled={!file || busy} onClick={() => send(true)}>
            Предпросмотр
          </SmallButton>
          <SmallButton gold disabled={!file || busy} onClick={() => send(false)}>
            Импортировать
          </SmallButton>
        </div>
      </Panel>

      {report && (
        <Panel>
          <PanelHead
            title={`Разобрано: ${report.valid?.length ?? 0} из ${report.total} · формат ${report.format}`}
          />
          {report.errors.length > 0 && (
            <div className="mb-4 rounded-xl border border-line-soft bg-bg-2 p-4 text-[12.5px] text-status-warn">
              Замечания: {report.errors.length}
              <ul className="mt-2 space-y-1 text-ink-muted">
                {report.errors.slice(0, 8).map((e, i) => (
                  <li key={i}>
                    строка {e.row}: {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Код", "Название", "Ед.", "Категория"].map((h) => (
                    <th
                      key={h}
                      className="border-b border-line-soft px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-gold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(report.valid ?? []).slice(0, 50).map((b) => (
                  <tr key={b.code} className="last:[&>td]:border-none">
                    <td className="border-b border-line-soft px-3.5 py-2.5 font-display text-[13px] text-gold-light">
                      {b.code}
                    </td>
                    <td className="border-b border-line-soft px-3.5 py-2.5 text-[13.5px] text-ink">
                      {b.name}
                    </td>
                    <td className="border-b border-line-soft px-3.5 py-2.5 text-[13px] text-ink-muted">
                      {b.unit ?? "—"}
                    </td>
                    <td className="border-b border-line-soft px-3.5 py-2.5 text-[13px] text-ink-muted">
                      {b.category ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </>
  );
}
