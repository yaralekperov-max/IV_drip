export function Footer() {
  return (
    <footer className="border-t border-line-soft px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4">
        <div className="font-display text-xl tracking-[0.26em] text-ink-muted">VENA</div>
        <p className="text-[13px] text-ink-dim">
          © Выездная IV-терапия для тех, кто ценит время
        </p>
        <div className="text-[11.5px] uppercase tracking-[0.1em] text-gold">Прототип · v0.2</div>
      </div>
    </footer>
  );
}
