# marketplace-template

Шаблон `marketplace` на `microservices` с контейнеризацией и `Kubernetes` manifests.

## Сервисы

- `users-api` - Java `Spring Boot`
- `goods-api` - Java `Spring Boot`
- `catalog-api` - Python `FastAPI`
- `search-api` - Python `FastAPI`
- `order-api` - Python `FastAPI`
- `favorite-api` - Java `Spring Boot`
- `cart-api` - Java `Spring Boot`
- `web` - React `Vite`

## Структура

```text
.
├── cart-api
├── catalog-api
├── favorite-api
├── goods-api
├── k8s
├── order-api
├── search-api
├── users-api
└── web
```

## Как использовать

1. Собери Docker images для каждого сервиса.
2. Замени image names в `k8s/base/*.yaml` на свои registry paths.
3. Примени manifests:
   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/base/
   kubectl apply -f k8s/ingress/
   ```
4. Для локального теста с `minikube` или `kind` можно использовать локальный registry.

## Замечания

- Это именно `template`, а не полноценная бизнес-реализация.
- У каждого сервиса есть минимальный health endpoint.
- `Ingress` маршрутизирует запросы на основе path prefix.
