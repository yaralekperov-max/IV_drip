import { cn } from "@/lib/utils/cn";

/** Заголовок экрана ЛК. */
export function ScreenHeader({
  title,
  accent,
  subtitle,
}: {
  title: string;
  accent?: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-7">
      <h1 className="mb-1.5 font-display text-[30px] font-light text-ink">
        {title} {accent && <em className="italic text-gold-light">{accent}</em>}
      </h1>
      {subtitle && <p className="text-[15px] font-light text-ink-muted">{subtitle}</p>}
    </div>
  );
}

/** Карточка-панель ЛК. */
export function PCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mb-5 rounded-[18px] border border-line-soft bg-panel p-[26px]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Шапка карточки: заголовок + опциональное действие справа. */
export function CardHead({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h3 className="text-base font-medium text-ink">{title}</h3>
      {action}
    </div>
  );
}

/** Строка списка (row) с нижним разделителем. */
export function Row({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-3.5 border-b border-line-soft py-3.5 last:border-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Золотая текстовая ссылка-действие. */
export function PLink({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("cursor-pointer text-[13px] text-gold hover:opacity-70", className)}
      role="button"
      tabIndex={0}
      {...props}
    />
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("text-[11px] uppercase tracking-[0.13em] text-gold", className)}>
      {children}
    </div>
  );
}

export type VisitStatus = "pending" | "confirmed" | "assigned" | "done" | "cancel" | "review";

const STATUS_STYLES: Record<VisitStatus, string> = {
  pending: "bg-[rgba(217,180,112,0.14)] text-status-warn",
  confirmed: "bg-[rgba(201,168,106,0.14)] text-gold",
  assigned: "bg-[rgba(122,168,201,0.14)] text-status-info",
  done: "bg-[rgba(127,184,138,0.12)] text-status-pos",
  cancel: "bg-[rgba(201,122,106,0.14)] text-status-neg",
  review: "bg-[rgba(217,180,112,0.14)] text-status-warn",
};

/** Статус-бейдж визита/анализа. */
export function StatusBadge({ status, children }: { status: VisitStatus; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded-full px-[11px] py-1 text-[11px]",
        STATUS_STYLES[status],
      )}
    >
      {children}
    </span>
  );
}

/** Пустое состояние (для «нового клиента»). */
export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: string;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="px-6 py-[50px] text-center">
      <div className="mb-4 text-[40px] opacity-70">{icon}</div>
      <h3 className="mb-2 text-xl font-normal text-ink">{title}</h3>
      <p className="mx-auto mb-[22px] max-w-[400px] text-[14px] font-light text-ink-muted">{text}</p>
      {action}
    </div>
  );
}
