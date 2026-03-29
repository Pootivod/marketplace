# search-api

Готовый `search-api` для marketplace на `FastAPI` + `OpenSearch`.

## Что умеет

- поиск товаров через `OpenSearch`
- синхронизация индекса при старте сервиса
- фоновая синхронизация каждые 10 минут
- ручной запуск `full sync` и `incremental sync`
- `Dockerfile` и `docker-compose` для локального запуска

## Архитектура

- `goods-api` — source of truth
- `search-api` — один сервис, который:
  - синхронизирует данные из `goods-api`
  - хранит индекс в `OpenSearch`
  - выполняет пользовательский поиск

## Предполагаемые endpoints у goods-api

### Вариант 1 — предпочтительный

```http
GET /api/v1/goods/sync?updatedAfter=2026-03-26T10:00:00Z&page=0&size=500
GET /api/v1/goods/all
```

### Вариант 2 — fallback

Если `GET /api/v1/goods/sync` не реализован, сервис автоматически переключится на:

```http
GET /api/v1/goods/all
```

## Пример формата товара из goods-api

```json
{
  "id": 101,
  "title": "Apple iPhone 15 Pro Max 256GB Black",
  "description": "Flagship smartphone",
  "brand": { "id": 10, "name": "Apple" },
  "category": { "id": 3, "name": "Smartphones" },
  "price": 1499.99,
  "currency": "USD",
  "rating": 4.8,
  "reviewCount": 932,
  "isAvailable": true,
  "stock": 15,
  "imageUrl": "https://example.com/image.jpg",
  "popularityScore": 0.84,
  "attributes": {
    "color": "black",
    "storage": "256gb"
  },
  "updatedAt": "2026-03-26T12:00:00Z"
}
```

## Запуск

Скопируй `.env.example` в `.env`:

```bash
cp .env.example .env
```

Потом запусти:

```bash
docker compose up --build
```

Сервис будет доступен на:

```text
http://localhost:8000
```

## Основные endpoints

### Поиск

```http
GET /api/v1/search?q=iphone&page=0&size=20&sort=relevance
```

Дополнительно поддерживаются параметры:

- `categoryId`
- `minPrice`
- `maxPrice`
- `inStock`
- `sort` = `relevance | price_asc | price_desc | rating_desc | newest`

### Статус синхронизации

```http
GET /internal/sync/status
```

### Полная синхронизация

```http
POST /internal/sync/full
```

### Инкрементальная синхронизация

```http
POST /internal/sync/incremental
```

## Как работает синхронизация

1. При старте сервиса создаётся индекс, если его нет.
2. Если индекс пустой — запускается `full sync`.
3. Если индекс уже есть — запускается `incremental sync`.
4. Потом сервис в фоне запускает `incremental sync` каждые `SYNC_INTERVAL_SECONDS`.

По умолчанию:

```text
SYNC_INTERVAL_SECONDS=600
```

то есть каждые 10 минут.

## Ограничения текущей реализации

- удалённые товары автоматически не убираются из индекса, если `goods-api` не отдаёт события удаления или список tombstone ids
- если endpoint `/api/v1/goods/sync` не существует, `incremental sync` будет делать fallback на `GET /api/v1/goods/all`
- безопасность `OpenSearch` в `docker-compose` отключена для локальной разработки

## Что можно добавить следующим этапом

- удаление документов из индекса по событиям
- `suggest` endpoint
- `Kubernetes manifests`
- `CronJob` вместо фонового thread
- alias-based reindex
- health/readiness endpoints


## Poetry

Управление зависимостями переведено на `Poetry`. Для локального запуска без Docker:

```bash
poetry install
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000
```

В `Dockerfile` зависимости тоже устанавливаются через `Poetry`.
