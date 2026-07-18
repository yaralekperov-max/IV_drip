"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

const LINKS = [
  { href: "#process", label: "Почему капельница" },
  { href: "#goals", label: "Что доставляем" },
  { href: "#safety", label: "Безопасность" },
  { href: "#b2b", label: "Компаниям" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[100] border-b border-transparent transition-all duration-300",
        scrolled && "border-line-soft bg-bg/80 backdrop-blur-md",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1180px] items-center justify-between px-6 transition-all duration-300 sm:px-10",
          scrolled ? "py-4" : "py-6",
        )}
      >
        <div className="pl-1 font-display text-[23px] font-medium tracking-[0.26em] text-ink">
          V<b className="font-medium text-gold">E</b>NA
        </div>
        <nav className="hidden gap-10 text-[13.5px] text-ink-muted md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative transition-colors hover:text-ink"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="rounded-full border border-gold px-6 py-2.5 text-[13.5px] tracking-wide text-gold transition-colors hover:bg-gold hover:text-bg"
        >
          Записаться
        </a>
      </div>
    </header>
  );
}
