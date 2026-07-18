import { Card, CardTitle, CardDescription } from "@/components/ui/Card";

/**
 * Личный кабинет клиента — заглушка каркаса (Этап 1).
 * Авторизация по SMS/Яндекс ID и разделы ЛК по prototypes/client-portal.html — Этап 3.
 */
export default function PortalPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl text-ink">Личный кабинет</h1>
      <p className="mt-2 text-ink-muted">
        Каркас. Разделы (главная, записаться, визиты, анализы, платежи, документы, бонусы,
        поддержка, профиль) — Этап&nbsp;3.
      </p>
      <Card className="mt-8">
        <CardTitle>Динамика анализов «было → стало»</CardTitle>
        <CardDescription>
          Ключевая ценность ЛК. Появится после сборки медконтура и проверки анализов врачом.
        </CardDescription>
      </Card>
    </main>
  );
}
