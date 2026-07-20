"use client";

import { useToast } from "@/components/ui/Toast";
import { PCard, CardHead, Row, ScreenHeader, PLink } from "@/components/portal/ui";

export default function DocumentsPage() {
  const toast = useToast();
  const open = () => toast.show("Демо: открытие документа");
  const pdf = () => toast.show("Демо: скачивание PDF");

  return (
    <>
      <ScreenHeader title="Документы" subtitle="Договор, согласия и медицинские выписки в одном месте." />
      <PCard>
        <CardHead title="Договоры и согласия" />
        <DocRow title="Договор-оферта на услуги" sub="подписан при регистрации · 12 мая" action={<PLink onClick={open}>Открыть</PLink>} />
        <DocRow title="Согласие на обработку медданных" sub="152-ФЗ · подписано 12 мая" action={<PLink onClick={open}>Открыть</PLink>} />
        <DocRow title="Информированное согласие на процедуру" sub="подписано перед визитом · 31 мая" action={<PLink onClick={open}>Открыть</PLink>} />
      </PCard>
      <PCard>
        <CardHead title="Медицинские выписки" />
        <DocRow title="Выписка по анализам — июнь" sub="динамика витамин D, ферритин, B12" action={<PLink onClick={pdf}>PDF</PLink>} />
        <DocRow title="Заключение врача по курсу" sub="Соколова Е. А. · 14 июня" action={<PLink onClick={pdf}>PDF</PLink>} />
      </PCard>
    </>
  );
}

function DocRow({ title, sub, action }: { title: string; sub: string; action: React.ReactNode }) {
  return (
    <Row>
      <div className="flex-grow">
        <h4 className="text-[14px] font-medium text-ink">{title}</h4>
        <p className="text-[12.5px] text-ink-dim">{sub}</p>
      </div>
      {action}
    </Row>
  );
}
