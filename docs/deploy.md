# Деплой — VENA

Приложение собирается в **портируемый Docker-образ** (Next.js `output: "standalone"`).
Один и тот же образ разворачивается на демо-площадке и в боевом контуре (Яндекс Облако, РФ).
Переезд демо → прод — это смена окружения и площадки, **не пересборка кода**.

## Сборка и запуск образа

```bash
docker build -t vena:latest .
docker run --rm -p 3000:3000 --env-file .env.local vena:latest
# проверка: http://localhost:3000  и  http://localhost:3000/api/health
```

Порт по умолчанию — 3000 (`PORT`), слушает `0.0.0.0`. В образе есть HEALTHCHECK на `/api/health`.

## Демо-деплой (моковые данные, без реальных ПДн)

Минимально нужно: площадка с Docker + домен/TLS. Данные — моковые, БД/ключи не обязательны.

Рекомендуемые переменные для демо:
```
NODE_ENV=production
AUTH_SESSION_SECRET=<длинная случайная строка>
NEXT_PUBLIC_APP_URL=https://<домен-демо>
# NEXT_PUBLIC_DEMO_MODE не задаём или "true" — виден переключатель состояний ЛК
```
Вход по SMS работает в dev-режиме (код возвращается в форме и в логах) — реальный провайдер не нужен.

⚠️ Админка (`/admin`) пока без входа. На демо держите её за неочевидным адресом/паролем на
уровне площадки (basic-auth в reverse-proxy) и **не публикуйте реальные данные** (152-ФЗ).

## Боевой контур (Яндекс Облако, РФ)

Тот же образ + боевые переменные и площадка в РФ:
```
NODE_ENV=production
NEXT_PUBLIC_DEMO_MODE=false           # скрыть демо-переключатель
AUTH_SESSION_SECRET=<секрет>
DATABASE_URL=...                       # Managed PostgreSQL
DATABASE_CA_CERT_PATH=.yandex-ca.pem   # CA Яндекса для TLS verify-full
S3_ENDPOINT / S3_BUCKET / S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY  # Object Storage
SMS_PROVIDER / SMS_PROVIDER_API_KEY    # реальный SMS
AMOCRM_BASE_URL / AMOCRM_ACCESS_TOKEN
YOOKASSA_SHOP_ID / YOOKASSA_SECRET_KEY
```

Перед боевым запуском (сверх образа): применить миграции (`db:migrate`), перенести OTP в БД,
подключить экраны к реальным данным, добавить staff-вход и роли для админки, пройти
юридические требования (152-ФЗ: юрист, договор с клиникой, тексты согласий). См. `docs/database.md`.

## Заметки
- Секреты не коммитим; передаём через переменные окружения площадки.
- HSTS/заголовки безопасности включены в `next.config.mjs` (HSTS работает по HTTPS).
- Rate-limit на запрос SMS-кода — in-memory (на инстанс). Для нескольких инстансов
  вынести в общий store (Redis/таблица).
