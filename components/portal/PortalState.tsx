"use client";

import { createContext, useContext, useEffect, useState } from "react";

/**
 * Демо-состояние ЛК: «новый клиент» (пустой) vs «активный» (наполненный).
 * В проде состояние будет вычисляться из реальных данных клиента (Этап 5).
 * Пока — переключатель для демонстрации обоих сценариев (как в прототипе).
 */
export type PortalState = "new" | "filled";

type Ctx = { state: PortalState; setState: (s: PortalState) => void };
const PortalStateContext = createContext<Ctx | null>(null);

const KEY = "vena_portal_demo_state";

export function PortalStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setStateRaw] = useState<PortalState>("filled");

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "new" || saved === "filled") setStateRaw(saved);
  }, []);

  const setState = (s: PortalState) => {
    setStateRaw(s);
    window.localStorage.setItem(KEY, s);
  };

  return (
    <PortalStateContext.Provider value={{ state, setState }}>
      {children}
    </PortalStateContext.Provider>
  );
}

export function usePortalState(): Ctx {
  const ctx = useContext(PortalStateContext);
  if (!ctx) throw new Error("usePortalState вне PortalStateProvider");
  return ctx;
}
