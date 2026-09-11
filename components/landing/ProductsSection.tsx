"use client";

import { useState } from "react";
import { PRODUCTS, PRODUCT_ORDER, type ProductKey } from "@/lib/content/products";
import { Reveal } from "./Reveal";
import { SectionHeading, Accent } from "./SectionHeading";
import { ProductModal } from "./ProductModal";

export function ProductsSection() {
  const [openKey, setOpenKey] = useState<ProductKey | null>(null);

  return (
    <section id="goals" className="px-6 py-[130px] sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="mb-14">
          <SectionHeading eyebrow="Что доставляем" centered>
            Выбираете состояние —
            <br />
            <Accent>привозим его к вам</Accent>
          </SectionHeading>
        </Reveal>

        <Reveal>
          <div className="grid gap-px border border-line-soft bg-line-soft md:grid-cols-3">
            {PRODUCT_ORDER.map((key) => {
              const p = PRODUCTS[key];
              return (
                <button
                  key={key}
                  onClick={() => setOpenKey(key)}
                  className="group bg-bg-2 p-10 text-left transition-colors duration-500 hover:bg-panel"
                >
                  <div className="mb-7 font-display text-[15px] tracking-[0.1em] text-gold">
                    {p.cardEyebrow}
                  </div>
                  <h3 className="mb-4 text-[25px] font-normal tracking-tight text-ink">
                    {p.cardTitle}
                  </h3>
                  <p className="text-[15px] font-light leading-relaxed text-ink-muted">
                    {p.cardText}
                  </p>
                  <span className="mt-4 inline-block translate-y-1 text-[13px] text-gold opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    {p.cardMore}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      {openKey && <ProductModal product={PRODUCTS[openKey]} onClose={() => setOpenKey(null)} />}
    </section>
  );
}
