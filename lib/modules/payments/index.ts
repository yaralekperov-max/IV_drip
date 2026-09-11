/**
 * Модуль «Платежи» — ЮKassa (эквайринг). Оплата визита/абонемента:
 * онлайн / при визите / бонусами. Создание платежа и приём вебхуков.
 *
 * Клиент и типы — в ./yookassa. Работает в режиме «skip», пока не заданы ключи.
 */

export { createPayment, parseWebhook, isYooKassaConfigured } from "./yookassa";
export type { CreatePaymentInput, CreatePaymentResult, WebhookEvent } from "./yookassa";
