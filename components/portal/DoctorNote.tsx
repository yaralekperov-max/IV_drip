import type { DoctorNote } from "@/lib/content/doctor-notes";
import { cn } from "@/lib/utils/cn";

/** Карточка рекомендации врача — используется в «Анализах» и на главной ЛК. */
export function DoctorNoteItem({
  note,
  compact = false,
  last = false,
}: {
  note: DoctorNote;
  compact?: boolean;
  last?: boolean;
}) {
  return (
    <div className={cn("py-4 first:pt-0", !last && "border-b border-line-soft")}>
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-line bg-gradient-to-br from-[#2a4a3c] to-[#1a2e24] text-base">
          🩺
        </div>
        <div className="min-w-0 flex-grow">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <h4 className="text-[14px] font-medium text-ink">{note.doctor}</h4>
            <span className="text-[11.5px] text-ink-dim">{note.role}</span>
          </div>
          <div className="mt-0.5 text-[11px] uppercase tracking-[0.08em] text-gold">
            {note.context} · {note.date}
          </div>
          <p className="mt-2 text-[13.5px] font-light leading-relaxed text-ink-muted">{note.text}</p>

          {!compact && note.points && note.points.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {note.points.map((p) => (
                <li key={p} className="flex gap-2 text-[13px] font-light text-ink-muted">
                  <span className="text-gold">•</span>
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
