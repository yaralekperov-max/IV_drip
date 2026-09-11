"use client";

import { useState } from "react";
import { usePortalState } from "@/components/portal/PortalState";
import { useToast } from "@/components/ui/Toast";
import { PCard, CardHead, ScreenHeader, EmptyState, StatusBadge, PLink } from "@/components/portal/ui";
import { TrendChart } from "@/components/portal/TrendChart";
import { DoctorNoteItem } from "@/components/portal/DoctorNote";
import { DOCTOR_NOTES } from "@/lib/content/doctor-notes";
import {
  BIOMARKER_HISTORY,
  markerDelta,
  type MarkerHistory,
} from "@/lib/content/biomarker-history";
import { cn } from "@/lib/utils/cn";

type UploadStage = "idle" | "consent" | "parsing" | "recognized" | "review";

export default function AnalysesPage() {
  const { state, setState } = usePortalState();
  const toast = useToast();
  const [stage, setStage] = useState<UploadStage>("idle");

  function startUpload() {
    // Как в прототипе: из пустого состояния переводим в наполненное и открываем загрузку.
    if (state === "new") setState("filled");
    setStage("consent");
  }

  if (state === "new") {
    return (
      <>
        <ScreenHeader
          title="Анализы"
          subtitle="Загружайте результаты из лаборатории — мы покажем динамику было→стало под контролем врача."
        />
        <PCard>
          <EmptyState
            icon="🩺"
            title="Анализов пока нет"
            text="Загрузите первый бланк PDF — после согласия на обработку медданных и проверки врачом он появится в динамике."
            action={
              <button
                onClick={startUpload}
                className="inline-block rounded-full bg-gold px-7 py-3.5 text-[14px] font-medium text-bg transition-colors hover:bg-gold-light"
              >
                Загрузить анализы
              </button>
            }
          />
        </PCard>
      </>
    );
  }

  return (
    <>
      <ScreenHeader title="Анализы:" accent="было → стало" />
      <PCard>
        <CardHead
          title="Динамика"
          action={<PLink onClick={startUpload}>+ Загрузить анализы</PLink>}
        />

        <UploadHost stage={stage} setStage={setStage} onReviewSent={() => toast.show("Отправлено врачу на проверку")} />

        {BIOMARKER_HISTORY.map((h, i) => (
          <Marker key={h.code} history={h} last={i === BIOMARKER_HISTORY.length - 1} />
        ))}
        <p className="mt-3.5 text-[12px] italic text-ink-dim">
          Показатели в пределах нормы. Интерпретация — за вашим врачом.
        </p>
      </PCard>

      <PCard>
        <CardHead title="Рекомендации врача" />
        {DOCTOR_NOTES.map((n, i) => (
          <DoctorNoteItem key={n.id} note={n} last={i === DOCTOR_NOTES.length - 1} />
        ))}
        <p className="mt-3.5 text-[12px] italic text-ink-dim">
          Рекомендации даёт ваш врач по результатам визитов и анализов. Это не замена очной
          консультации — при ухудшении самочувствия обратитесь к врачу.
        </p>
      </PCard>
    </>
  );
}

function UploadHost({
  stage,
  setStage,
  onReviewSent,
}: {
  stage: UploadStage;
  setStage: (s: UploadStage) => void;
  onReviewSent: () => void;
}) {
  const [medConsent, setMedConsent] = useState(true);

  if (stage === "idle") return null;

  if (stage === "consent") {
    return (
      <div className="mb-[18px]">
        <div
          onClick={() => setMedConsent((v) => !v)}
          className={cn(
            "mb-3.5 flex cursor-pointer items-start gap-3 rounded-xl border bg-bg-2 p-4 transition-colors",
            medConsent ? "border-gold" : "border-line-soft hover:border-line",
          )}
        >
          <div
            className={cn(
              "flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-md border text-[13px] text-bg",
              medConsent ? "border-gold bg-gold" : "border-line",
            )}
          >
            {medConsent && "✓"}
          </div>
          <div className="text-[13px] font-light leading-relaxed text-ink-muted">
            Согласен на обработку <b className="font-medium text-ink">медицинских данных</b> и их
            распознавание для отображения динамики (152-ФЗ)
          </div>
        </div>
        <label
          className={cn(
            "block rounded-[14px] border-[1.5px] border-dashed border-line bg-[rgba(201,168,106,0.03)] p-[22px] text-center",
            medConsent ? "cursor-pointer" : "pointer-events-none opacity-50",
          )}
        >
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={() => {
              setStage("parsing");
              setTimeout(() => setStage("recognized"), 1500);
            }}
          />
          <div className="mb-2 text-2xl">📄</div>
          <div className="text-[13px] text-ink-muted">
            <b className="text-ink">Загрузите PDF из лаборатории</b>
            <br />
            мы распознаем показатели
          </div>
        </label>
      </div>
    );
  }

  if (stage === "parsing") {
    return (
      <div className="mb-[18px] flex items-center gap-3 rounded-[14px] border border-line-soft p-5">
        <span className="h-[22px] w-[22px] animate-spin rounded-full border-2 border-line border-t-gold" />
        <span className="text-[13px] text-ink-muted">Распознаём показатели…</span>
      </div>
    );
  }

  if (stage === "recognized") {
    return (
      <div className="mb-[18px] rounded-[14px] border border-gold bg-[rgba(201,168,106,0.05)] p-5">
        <div className="mb-3.5 flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(201,168,106,0.18)] text-gold">
            ✓
          </div>
          <h4 className="text-[14px] font-medium text-ink">Распознано 4 показателя · ИНВИТРО</h4>
        </div>
        <div className="py-1.5 text-[13.5px] text-ink-muted">
          Витамин D — <b className="font-display text-gold-light">52</b>
        </div>
        <div className="py-1.5 text-[13.5px] text-ink-muted">
          Ферритин — <b className="font-display text-gold-light">65</b>
        </div>
        <div className="mt-3 border-t border-line-soft pt-3 text-[12px] italic text-ink-muted">
          Перед добавлением в динамику показатели{" "}
          <b className="not-italic text-status-warn">проверит ваш врач</b>.
        </div>
        <button
          onClick={() => {
            setStage("review");
            onReviewSent();
          }}
          className="mt-3.5 w-full rounded-full bg-gold py-3 text-[14px] font-medium text-bg transition-colors hover:bg-gold-light"
        >
          Отправить на проверку
        </button>
      </div>
    );
  }

  // review
  return (
    <div className="mb-[18px] flex gap-3.5 rounded-[14px] border border-line bg-bg-2 p-5">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(217,180,112,0.14)] text-status-warn">
        🕓
      </div>
      <div>
        <h4 className="mb-1 text-[14px] font-medium text-ink">Анализы на проверке у врача</h4>
        <p className="text-[12.5px] font-light text-ink-muted">
          Врач сверит показатели и добавит в динамику. Обычно несколько часов.
        </p>
        <div className="mt-2">
          <StatusBadge status="review">на проверке врачом</StatusBadge>
        </div>
      </div>
    </div>
  );
}

/**
 * Один биомаркер: заголовок с изменением, график тренда и строка «было → стало».
 * Строка дублирует значения графика — они доступны без наведения (тултип ничего не «запирает»).
 */
function Marker({ history, last }: { history: MarkerHistory; last?: boolean }) {
  const d = markerDelta(history);
  const refText =
    history.refMin !== undefined && history.refMax !== undefined
      ? `${history.unit} · норма ${history.refMin}–${history.refMax}`
      : history.unit;

  return (
    <div className={cn("py-4", !last && "border-b border-line-soft")}>
      <div className="mb-2.5 flex justify-between">
        <div className="text-[14px] text-ink">
          {history.name}
          <span className="block text-[11.5px] text-ink-dim">{refText}</span>
        </div>
        {d && (
          <div
            className={cn(
              "text-[13px] font-medium",
              d.delta > 0 ? "text-status-pos" : d.delta < 0 ? "text-status-neg" : "text-ink-muted",
            )}
          >
            {d.delta > 0 ? "↑ +" : d.delta < 0 ? "↓ " : ""}
            {d.delta !== 0 ? d.delta : "без изменений"}
          </div>
        )}
      </div>

      <TrendChart history={history} />

      {d && (
        <div className="mt-1 flex items-center gap-3.5">
          <div className="flex-1">
            <div className="text-[11px] uppercase text-ink-dim">Было · {d.first.label}</div>
            <div className="font-display text-[18px] text-ink">{d.first.value}</div>
          </div>
          <div className="text-gold">→</div>
          <div className="flex-1">
            <div className="text-[11px] uppercase text-ink-dim">Стало · {d.last.label}</div>
            <div className="font-display text-[18px] text-ink">{d.last.value}</div>
          </div>
        </div>
      )}
    </div>
  );
}
