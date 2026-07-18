import Link from "next/link";
import { Button } from "@/components/ui/Button";

/**
 * Лендинг — заглушка каркаса (Этап 1).
 * Полная сборка блоков по prototypes/landing.html — Этап 2.
 */
export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-gold">VENA</p>
      <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">
        Энергия и тонус. С доставкой к вам.
      </h1>
      <p className="mt-4 max-w-xl text-ink-muted">
        Премиальная выездная IV-терапия в Москве. Каркас проекта готов — лендинг собирается
        на Этапе&nbsp;2.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button>Оставить заявку</Button>
        <Link href="/portal">
          <Button variant="secondary">Личный кабинет</Button>
        </Link>
        <Link href="/admin">
          <Button variant="ghost">Админ-панель</Button>
        </Link>
      </div>
    </main>
  );
}
