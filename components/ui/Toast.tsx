"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/utils/cn";

type Toast = { id: number; message: string; tone: "info" | "success" | "error" };

type ToastContextValue = {
  show: (message: string, tone?: Toast["tone"]) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/** Хук для показа тостов из любого клиентского компонента. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast должен использоваться внутри <ToastProvider>.");
  return ctx;
}

const toneStyles: Record<Toast["tone"], string> = {
  info: "border-gold/40",
  success: "border-emerald-500/40",
  error: "border-red-500/40",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback<ToastContextValue["show"]>((message, tone = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "rounded-xl border bg-panel px-4 py-3 text-sm text-ink shadow-soft",
              toneStyles[t.tone],
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
