import { cn } from "@/lib/utils/cn";

/** Верхняя панель раздела админки: заголовок + действия справа. */
export function Topbar({
  title,
  accent,
  actions,
}: {
  title: string;
  accent?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-display text-[26px] font-light text-ink">
        {title} {accent && <em className="italic text-gold-light">{accent}</em>}
      </h1>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

/** «Пилюля» с датой/счётчиком в топбаре. */
export function DatePill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border border-line-soft px-4 py-2 text-[13px] text-ink-muted">
      {children}
    </div>
  );
}

/** KPI-карточка сводки. */
export function Kpi({
  label,
  value,
  delta,
  down,
}: {
  label: string;
  value: string;
  delta?: string;
  down?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line-soft bg-panel px-6 py-[22px]">
      <div className="mb-2.5 text-[12px] text-ink-muted">{label}</div>
      <div className="mb-2 font-display text-[30px] leading-none text-ink">{value}</div>
      {delta && (
        <div className={cn("text-[12px]", down ? "text-status-neg" : "text-status-pos")}>{delta}</div>
      )}
    </div>
  );
}

/** Панель-контейнер. */
export function Panel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-[18px] rounded-2xl border border-line-soft bg-panel p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function PanelHead({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-[18px] flex items-center justify-between">
      <h3 className="text-base font-medium text-ink">{title}</h3>
      {action}
    </div>
  );
}

export function AdminLink({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      role="button"
      tabIndex={0}
      className={cn("cursor-pointer text-[12.5px] text-gold hover:opacity-70", className)}
      {...props}
    />
  );
}

export type AdminStatus =
  | "new"
  | "confirmed"
  | "assigned"
  | "done"
  | "pending"
  | "active"
  | "busy";

const STATUS: Record<AdminStatus, string> = {
  new: "bg-[rgba(122,168,201,0.14)] text-status-info",
  confirmed: "bg-[rgba(201,168,106,0.14)] text-gold",
  assigned: "bg-[rgba(127,184,138,0.14)] text-status-pos",
  done: "bg-[rgba(168,181,173,0.1)] text-ink-muted",
  pending: "bg-[rgba(217,180,112,0.14)] text-status-warn",
  active: "bg-[rgba(127,184,138,0.14)] text-status-pos",
  busy: "bg-[rgba(201,122,106,0.14)] text-status-neg",
};

export function AdminBadge({
  status,
  children,
}: {
  status: AdminStatus;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px]",
        STATUS[status],
      )}
    >
      {children}
    </span>
  );
}

/** Маленькие кнопки в таблицах. */
export function SmallButton({
  gold,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { gold?: boolean }) {
  return (
    <button
      className={cn(
        "rounded-lg border px-3.5 py-[7px] text-[12px] transition-colors",
        gold
          ? "border-gold bg-gold font-medium text-bg hover:bg-gold-light"
          : "border-line text-ink hover:border-gold",
        className,
      )}
      {...props}
    />
  );
}
