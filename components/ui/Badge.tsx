import { cn } from "@/lib/utils/cn";

type Tone = "neutral" | "gold" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-white/5 text-ink-muted",
  gold: "bg-gold/15 text-gold-light",
  success: "bg-emerald-500/15 text-emerald-300",
  warning: "bg-amber-500/15 text-amber-300",
  danger: "bg-red-500/15 text-red-300",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

/** Статус-бейдж (напр. «на подтверждении», «на проверке врачом», «выполнен»). */
export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
