/**
 * Интеграция с amoCRM (операционный контур).
 *
 * amoCRM — мастер-система заявок, контактов, воронки. Здесь — создание лида из формы
 * заявки лендинга и из записи в ЛК. Связка с медконтуром — по client_id (в проде
 * сохраняем amocrm_id в таблице clients).
 *
 * ВАЖНО (152-ФЗ): в amoCRM уходят операционные данные (имя, телефон, программа),
 * НЕ медданные. Результаты анализов и биомаркеры остаются в изолированном медконтуре.
 */

import { amoFetch, isAmoConfigured } from "./client";

export { isAmoConfigured } from "./client";

export type LeadSource = "landing" | "booking" | "support";

export type CreateLeadInput = {
  name: string;
  phone: string;
  /** Что интересует / программа. */
  interest?: string;
  /** Сумма сделки, ₽ (для записи с оплатой). */
  priceRub?: number;
  source: LeadSource;
  /** Доп. заметка (желаемый слот, адрес и т.п.). */
  note?: string;
};

export type CreateLeadResult = { skipped: true } | { skipped: false; leadId: number };

const SOURCE_TAGS: Record<LeadSource, string> = {
  landing: "Лендинг",
  booking: "Запись в ЛК",
  support: "Поддержка",
};

/**
 * Создаёт лид с контактом в amoCRM (endpoint /api/v4/leads/complex).
 * Если интеграция не настроена — возвращает { skipped: true } (не роняет флоу).
 */
export async function createLead(input: CreateLeadInput): Promise<CreateLeadResult> {
  if (!isAmoConfigured()) {
    console.info("[amocrm] skip (не настроено):", { source: input.source, interest: input.interest });
    return { skipped: true };
  }

  const name = input.interest
    ? `${SOURCE_TAGS[input.source]}: ${input.interest} — ${input.name}`
    : `${SOURCE_TAGS[input.source]} — ${input.name}`;

  const complex = [
    {
      name,
      price: input.priceRub,
      _embedded: {
        tags: [{ name: SOURCE_TAGS[input.source] }],
        contacts: [
          {
            name: input.name,
            custom_fields_values: [
              {
                field_code: "PHONE",
                values: [{ value: input.phone, enum_code: "MOB" }],
              },
            ],
          },
        ],
      },
    },
  ];

  const result = await amoFetch<Array<{ id: number }>>("/api/v4/leads/complex", {
    method: "POST",
    body: complex,
  });
  const leadId = Array.isArray(result) ? result[0]?.id : undefined;
  return leadId ? { skipped: false, leadId } : { skipped: true };
}
