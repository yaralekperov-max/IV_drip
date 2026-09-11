"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Row } from "./ui";

/** Строка настройки с переключателем (уведомления в профиле). */
export function ToggleRow({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <Row>
      <div className="flex-grow">
        <h4 className="text-[14px] font-normal text-ink">{label}</h4>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative h-6 w-[42px] rounded-full transition-colors",
          on ? "bg-gold" : "bg-line-soft",
        )}
      >
        <span
          className={cn(
            "absolute top-[3px] h-[18px] w-[18px] rounded-full bg-bg transition-all",
            on ? "left-[21px]" : "left-[3px]",
          )}
        />
      </button>
    </Row>
  );
}
