import { Card, CardTitle, CardDescription } from "@/components/ui/Card";

/**
 * Админ-панель — заглушка каркаса (Этап 1).
 * Разделы по prototypes/admin-panel.html, фокус на проверке анализов врачом — Этап 4.
 */
export default function AdminPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl text-ink">Админ-панель</h1>
      <p className="mt-2 text-ink-muted">
        Каркас. Сводка, заявки, бригады, клиенты — Этап&nbsp;4.
      </p>
      <Card className="mt-8">
        <CardTitle>Проверка анализов врачом</CardTitle>
        <CardDescription>
          Наш уникальный экран медконтура: врач сверяет распознанное с PDF, правит,
          подтверждает → биомаркеры попадают в динамику клиента.
        </CardDescription>
      </Card>
    </main>
  );
}
