import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Layout админ-панели.
 *
 * TODO (Этап 5): аутентификация и роли персонала (врач/оператор) — сейчас раздел открыт
 * (как в прототипе, данные моковые). Отдельный вход для сотрудников появится вместе с БД
 * и ролевой моделью; клиентская SMS-сессия для админки не подходит.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ambient min-h-screen">
      <div className="relative z-[1]">
        <AdminShell>{children}</AdminShell>
      </div>
    </div>
  );
}
