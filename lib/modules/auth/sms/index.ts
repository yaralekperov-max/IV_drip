import type { SmsSender } from "./types";

export type { SmsSender } from "./types";

/**
 * Dev-провайдер: не отправляет реальную SMS, а пишет код в консоль сервера.
 * Используется без настроенного провайдера (локальная разработка, демо на моках).
 */
class ConsoleSmsSender implements SmsSender {
  readonly name = "console(dev)";
  async send(phone: string, message: string): Promise<void> {
    console.info(`[sms:dev] → ${phone}: ${message}`);
  }
}

/**
 * Заготовка боевого провайдера (напр. SMS.ru). Реальный HTTP-вызов добавим,
 * когда появятся доступы. Требует SMS_PROVIDER_API_KEY.
 *
 * ВАЖНО (152-ФЗ): провайдер должен быть российским, данные не покидают РФ.
 */
class SmsRuSender implements SmsSender {
  readonly name = "sms.ru";
  constructor(private readonly apiKey: string) {}
  async send(phone: string, message: string): Promise<void> {
    // TODO (Этап 6): реальный запрос к API провайдера.
    void message;
    throw new Error(
      `SMS-провайдер '${this.name}' ещё не реализован (нужны доступы). Телефон: ${phone}`,
    );
  }
}

let cached: SmsSender | null = null;

/** Возвращает активный SMS-провайдер по переменным окружения. */
export function getSmsSender(): SmsSender {
  if (cached) return cached;
  const provider = process.env.SMS_PROVIDER;
  const apiKey = process.env.SMS_PROVIDER_API_KEY;
  if (provider === "sms.ru" && apiKey) {
    cached = new SmsRuSender(apiKey);
  } else {
    cached = new ConsoleSmsSender();
  }
  return cached;
}
