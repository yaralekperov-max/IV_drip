"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { ToastProvider } from "@/components/ui/Toast";
import { DEMO_MODE } from "@/lib/config/demo";
import { PortalStateProvider, usePortalState } from "./PortalState";

const NAV = [
  { href: "/portal", icon: "⌂", label: "Главная" },
  { href: "/portal/booking", icon: "✚", label: "Записаться" },
  { href: "/portal/visits", icon: "◷", label: "Мои визиты" },
  { href: "/portal/analyses", icon: "🩺", label: "Анализы" },
  { href: "/portal/payments", icon: "₽", label: "Платежи" },
  { href: "/portal/documents", icon: "▤", label: "Документы" },
  { href: "/portal/bonuses", icon: "★", label: "Бонусы" },
  { href: "/portal/support", icon: "☎", label: "Поддержка" },
  { href: "/portal/profile", icon: "⚙", label: "Профиль" },
];

function initials(name?: string): string {
  if (!name) return "VN";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export function PortalShell({
  userName,
  children,
}: {
  userName?: string;
  children: React.ReactNode;
}) {
  return (
    <PortalStateProvider>
      <ToastProvider>
        <ShellInner userName={userName}>{children}</ShellInner>
      </ToastProvider>
    </PortalStateProvider>
  );
}

function ShellInner({ userName, children }: { userName?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="relative z-[1] flex min-h-screen">
      {/* sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-shrink-0 flex-col border-r border-line-soft bg-bg-2 transition-transform md:translate-x-0",
          navOpen ? "translate-x-0 shadow-[0_0_40px_rgba(0,0,0,0.5)]" : "-translate-x-full",
        )}
      >
        <div className="border-b border-line-soft p-6 font-display text-[21px] tracking-[0.22em]">
          V<b className="text-gold">E</b>NA
          <span className="mt-1 block font-sans text-[10px] uppercase tracking-[0.12em] text-ink-dim">
            Личный кабинет
          </span>
        </div>
        <nav className="flex-grow overflow-y-auto p-3">
          {NAV.map((item) => {
            const active =
              item.href === "/portal" ? pathname === "/portal" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setNavOpen(false)}
                className={cn(
                  "mb-0.5 flex items-center gap-3 rounded-[10px] px-3.5 py-[11px] text-[14px] transition-colors",
                  active
                    ? "bg-[rgba(201,168,106,0.1)] text-gold-light"
                    : "text-ink-muted hover:bg-panel hover:text-ink",
                )}
              >
                <span className="w-[18px] text-center text-[15px]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/portal/profile"
          onClick={() => setNavOpen(false)}
          className="flex items-center gap-3 border-t border-line-soft px-5 py-4"
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-light text-sm font-semibold text-bg">
            {initials(userName)}
          </div>
          <div>
            <b className="block text-[13px] font-medium text-ink">{userName ?? "Клиент"}</b>
            <span className="text-[11px] text-ink-dim">Gold-клиент</span>
          </div>
        </Link>
      </aside>

      {/* backdrop for mobile nav */}
      {navOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setNavOpen(false)}
          aria-hidden
        />
      )}

      {/* content */}
      <main className="w-full max-w-[1020px] flex-grow px-5 pb-16 pt-5 md:ml-60 md:w-[calc(100%-240px)] md:px-10 md:pt-8">
        <div className="mb-[18px] flex items-center gap-3.5 md:hidden">
          <button className="text-2xl" onClick={() => setNavOpen(true)} aria-label="Меню">
            ☰
          </button>
          <div className="font-display text-lg tracking-[0.22em]">
            V<b className="text-gold">E</b>NA
          </div>
        </div>
        {DEMO_MODE && <DemoStatebar />}
        {children}
      </main>
    </div>
  );
}

/** Панель переключения демо-состояния (как в прототипе — «только для демо»). */
function DemoStatebar() {
  const { state, setState } = usePortalState();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-line bg-panel px-3.5 py-2.5 text-[12px] text-ink-muted">
      <b className="text-gold">Демо-состояния:</b>
      <StateBtn active={state === "filled"} onClick={() => setState("filled")}>
        Активный клиент
      </StateBtn>
      <StateBtn active={state === "new"} onClick={() => setState("new")}>
        Новый клиент (пустой ЛК)
      </StateBtn>
      <button
        onClick={logout}
        className="rounded-full border border-line-soft px-3 py-1.5 text-[12px] transition-colors hover:border-gold hover:text-ink"
      >
        Выйти
      </button>
      <span className="ml-auto text-ink-dim">переключатель только для демо</span>
    </div>
  );
}

function StateBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-[12px] transition-colors",
        active ? "border-gold text-ink" : "border-line-soft hover:border-gold hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
