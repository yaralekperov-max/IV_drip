import { cn } from "@/lib/utils/cn";

export type Step = { num: string; title: string; text: string };

/** Сетка «шагов»/преимуществ (3 колонки) с тонкими разделителями — как в прототипе. */
export function StepsGrid({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <div
      className={cn(
        "mt-16 grid gap-px border border-line-soft bg-line-soft md:grid-cols-3",
        className,
      )}
    >
      {steps.map((s) => (
        <div key={s.title} className="bg-bg-2 p-10 transition-colors duration-500 hover:bg-panel">
          <div className="mb-7 font-display text-[15px] tracking-[0.1em] text-gold">{s.num}</div>
          <h3 className="mb-4 text-[25px] font-normal tracking-tight text-ink">{s.title}</h3>
          <p className="text-[15px] font-light leading-relaxed text-ink-muted">{s.text}</p>
        </div>
      ))}
    </div>
  );
}
