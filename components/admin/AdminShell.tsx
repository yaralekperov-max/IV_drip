"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { ToastProvider } from "@/components/ui/Toast";
import { AdminStateProvider, useAdminState } from "./AdminState";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminStateProvider>
      <ToastProvider>
        <ShellInner>{children}</ShellInner>
      </ToastProvider>
    </AdminStateProvider>
  );
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const { requestsCount, analysesPending } = useAdminState();

  const NAV = [
    { href: "/admin", icon: "▤", label: "Сводка" },
    { href: "/admin/requests", icon: "✦", label: "Заявки", badge: requestsCount },
    { href: "/admin/brigades", icon: "⚕", label: "Бригады" },
    { href: "/admin/clients", icon: "◷", label: "Клиенты" },
    { href: "/admin/analyses", icon: "🩺", label: "Анализы", badge: analysesPending },
    { href: "/admin/biomarkers", icon: "🧬", label: "Справочник" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[230px] flex-shrink-0 flex-col border-r border-line-soft bg-bg-2 transition-transform md:translate-x-0",
          navOpen ? "translate-x-0 shadow-[0_0_40px_rgba(0,0,0,0.5)]" : "-translate-x-full",
        )}
      >
        <div className="border-b border-line-soft p-6 font-display text-[20px] tracking-[0.22em]">
          V<b className="text-gold">E</b>NA
          <span className="mt-1 block font-sans text-[10px] uppercase tracking-[0.14em] text-ink-dim">
            Админ-панель
          </span>
        </div>
        <nav className="flex-grow p-3">
          {NAV.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setNavOpen(false)}
                className={cn(
                  "mb-0.5 flex items-center gap-3 rounded-[10px] px-3.5 py-3 text-[14px] transition-colors",
                  active
                    ? "bg-[rgba(201,168,106,0.1)] text-gold-light"
                    : "text-ink-muted hover:bg-panel hover:text-ink",
                )}
              >
                <span className="w-5 text-center text-base">{item.icon}</span>
                {item.label}
                {item.badge ? (
                  <span className="ml-auto rounded-full bg-gold px-2 py-px text-[11px] font-semibold text-bg">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 border-t border-line-soft px-5 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line bg-gradient-to-br from-[#2a4a3c] to-[#1a2e24] text-[15px]">
            🩺
          </div>
          <div>
            <b className="block text-[13px] font-medium text-ink">Соколова Е. А.</b>
            <span className="text-[11px] text-ink-dim">врач · к.м.н.</span>
          </div>
        </div>
      </aside>

      {navOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setNavOpen(false)}
          aria-hidden
        />
      )}

      <main className="w-full flex-grow px-5 pb-16 pt-5 md:ml-[230px] md:w-[calc(100%-230px)] md:px-9 md:pt-7">
        <div className="mb-5 flex items-center gap-3.5 md:hidden">
          <button className="text-2xl" onClick={() => setNavOpen(true)} aria-label="Меню">
            ☰
          </button>
          <div className="font-display text-lg tracking-[0.22em]">
            V<b className="text-gold">E</b>NA
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
