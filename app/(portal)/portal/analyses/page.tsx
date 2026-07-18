"use client";

import { useState } from "react";
import { usePortalState } from "@/components/portal/PortalState";
import { useToast } from "@/components/ui/Toast";
import { PCard, CardHead, ScreenHeader, EmptyState, StatusBadge, PLink } from "@/components/portal/ui";
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

        <Marker name="Витамин D" unit="нг/мл · норма 30–100" delta="↑ +18" was="19" wasDate="12 мая" now="37" nowDate="14 июня" />
        <Marker name="Ферритин" unit="нг/мл · норма 30–400" delta="↑ +26" was="22" wasDate="12 мая" now="48" nowDate="14 июня" last />
        <p className="mt-3.5 text-[12px] italic text-ink-dim">
          Показатели в пределах нормы. Интерпретация — за вашим врачом.
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

function Marker({
  name,
  unit,
  delta,
  was,
  wasDate,
  now,
  nowDate,
  last,
}: {
  name: string;
  unit: string;
  delta: string;
  was: string;
  wasDate: string;
  now: string;
  nowDate: string;
  last?: boolean;
}) {
  return (
    <div className={cn("py-4", !last && "border-b border-line-soft")}>
      <div className="mb-2.5 flex justify-between">
        <div className="text-[14px] text-ink">
          {name}
          <span className="block text-[11.5px] text-ink-dim">{unit}</span>
        </div>
        <div className="text-[13px] font-medium text-status-pos">{delta}</div>
      </div>
      <div className="flex items-center gap-3.5">
        <div className="flex-1">
          <div className="text-[11px] uppercase text-ink-dim">Было · {wasDate}</div>
          <div className="font-display text-[18px] text-ink">{was}</div>
        </div>
        <div className="text-gold">→</div>
        <div className="flex-1">
          <div className="text-[11px] uppercase text-ink-dim">Стало · {nowDate}</div>
          <div className="font-display text-[18px] text-ink">{now}</div>
        </div>
      </div>
    </div>
  );
}
