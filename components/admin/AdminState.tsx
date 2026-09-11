"use client";

import { createContext, useContext, useState } from "react";

/**
 * Лёгкое состояние админки для бейджей сайдбара (кол-во заявок / анализов на проверке).
 * На моках; после подтверждения анализа счётчик уменьшается — как в прототипе.
 * На Этапе 5 значения придут из БД.
 */
type Ctx = {
  requestsCount: number;
  analysesPending: number;
  decAnalysesPending: () => void;
};

const AdminStateContext = createContext<Ctx | null>(null);

export function AdminStateProvider({ children }: { children: React.ReactNode }) {
  const [requestsCount] = useState(3);
  const [analysesPending, setAnalysesPending] = useState(2);

  return (
    <AdminStateContext.Provider
      value={{
        requestsCount,
        analysesPending,
        decAnalysesPending: () => setAnalysesPending((n) => Math.max(0, n - 1)),
      }}
    >
      {children}
    </AdminStateContext.Provider>
  );
}

export function useAdminState(): Ctx {
  const ctx = useContext(AdminStateContext);
  if (!ctx) throw new Error("useAdminState вне AdminStateProvider");
  return ctx;
}
