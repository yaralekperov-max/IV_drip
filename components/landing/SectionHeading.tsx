import { cn } from "@/lib/utils/cn";

/** Заголовок секции: золотой eyebrow + крупный заголовок (Fraunces). */
export function SectionHeading({
  eyebrow,
  children,
  centered = false,
  className,
}: {
  eyebrow: string;
  children: React.ReactNode;
  centered?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(centered && "mx-auto max-w-[680px] text-center", className)}>
      <div className="mb-5 text-[12.5px] uppercase tracking-[0.22em] text-gold">{eyebrow}</div>
      <h2
        className={cn(
          "max-w-[760px] font-display text-[clamp(32px,4.4vw,52px)] font-light leading-[1.12] tracking-tight text-ink",
          centered && "mx-auto",
        )}
      >
        {children}
      </h2>
    </div>
  );
}

/** Курсивный золотой акцент внутри заголовков. */
export function Accent({ children }: { children: React.ReactNode }) {
  return <em className="italic text-gold-light">{children}</em>;
}
