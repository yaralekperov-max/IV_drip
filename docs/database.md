# База данных — VENA (Этап 5)

БД — **Managed Service for PostgreSQL** в Яндекс Облаке (российский контур, 152-ФЗ).
ORM — **Drizzle**. Схема: `lib/db/schema.ts`. Подключение: `lib/db/client.ts` (TLS `verify-full`).

## Два контура (изоляция медданных)

| Контур | Схема PostgreSQL | Таблицы |
|---|---|---|
| Операционный | `public` | `clients`, `addresses`, `visits`, `payments`, `staff`, `otp_codes` |
| Медицинский (152-ФЗ) | `medical` | `biomarker_catalog`, `analysis_uploads`, `biomarker_results` |

**Медицинские таблицы намеренно не имеют внешних ключей в операционный контур.** Связь с
клиентом — по `client_id` на уровне приложения. Это сохраняет возможность вынести медконтур
на отдельный российский сервер без переписывания связей (см. `docs/architecture.md`).

## Ключевые сущности

- **visits** — запись = «желаемый слот» со статусом (`pending → confirmed → assigned → done/cancelled`).
- **analysis_uploads** — загрузка PDF клиентом (ключ файла в Object Storage), статус гибридного
  флоу (`parsing → awaiting_review → approved/rejected`), фиксация согласия на медданные.
- **biomarker_results** — распознанные/подтверждённые показатели загрузки; после `approved`
  формируют динамику «было→стало».
- **biomarker_catalog** — справочник показателей (см. ниже).

## Справочник биомаркеров

Гибкая структура — заполняется, когда появится список. Поля: `code` (машинный ключ),
`name`, `unit`, `category`, `aliases` (синонимы из разных лабораторий), `referenceRanges`
(нормы), `sort`, `active`, `description`.

`referenceRanges` — JSONB-массив, поддерживает зависимость нормы от пола/возраста:

```json
[{ "sex": "female", "ageMin": 18, "ageMax": 50, "min": 13, "max": 150 }]
```

Простой случай — одна пара `{ "min": 30, "max": 100 }`.

### Загрузка списка (несколько форматов)

Импорт терпим к формату и названиям колонок (рус./англ.): **JSON, CSV, TSV**.
Excel — сохраните лист как CSV. Код (`code`) можно не указывать — сгенерируется из названия.
Повторная загрузка обновляет записи по `code` (idempotent), не создавая дублей.

**Способ 1 — скрипт (seed):**
```bash
npm run db:seed:biomarkers -- data/biomarkers.json      # или .csv / .tsv
```
Без аргумента берётся `data/biomarkers.json`, иначе `data/biomarkers.sample.json`.

**Способ 2 — админка:** раздел «Справочник» → загрузка файла с предпросмотром, затем импорт.
API: `POST /api/admin/biomarkers/import` (`?dryRun=1` — только разбор без записи).

Примеры файлов: `data/biomarkers.sample.json`, `data/biomarkers.sample.csv`.

## Миграции

```bash
npm run db:generate   # сгенерировать SQL-миграции из схемы (в ./drizzle)
npm run db:migrate    # применить к БД (нужен DATABASE_URL)
npm run db:studio     # визуальный просмотр (нужен DATABASE_URL)
```

## Переменные окружения

См. `.env.example`: `DATABASE_URL`, `DATABASE_CA_CERT_PATH` (CA Яндекса для TLS),
`S3_*` (Object Storage). Секреты не коммитим.

## Статус подключения

Схема, миграции и импорт справочника готовы. Подключение экранов ЛК/админки к реальным
данным (вместо моков) и перенос OTP из памяти в таблицу `otp_codes` выполняются после
провижининга БД (появления `DATABASE_URL`).
