SHELL := /bin/bash

.PHONY: start stop \
        up-web down-web \
        up-gateway-api down-gateway-api \
        up-users-api down-users-api \
        up-keycloak down-keycloak \
        up-postgres-users down-postgres-users \
        up-postgres-keycloak down-postgres-keycloak \
        up-pgadmin down-pgadmin

start:
	@./scripts/start.sh

stop:
	@./scripts/stop.sh

up-web:
	@./scripts/up-service.sh web

down-web:
	@./scripts/down-service.sh web

up-gateway-api:
	@./scripts/up-service.sh gateway-api

down-gateway-api:
	@./scripts/down-service.sh gateway-api

up-users-api:
	@./scripts/up-service.sh users-api

down-users-api:
	@./scripts/down-service.sh users-api

up-keycloak:
	@./scripts/up-service.sh keycloak

down-keycloak:
	@./scripts/down-service.sh keycloak

up-postgres-users:
	@./scripts/up-service.sh postgres-users

down-postgres-users:
	@./scripts/down-service.sh postgres-users

up-postgres-keycloak:
	@./scripts/up-service.sh postgres-keycloak

down-postgres-keycloak:
	@./scripts/down-service.sh postgres-keycloak

up-pgadmin:
	@./scripts/up-service.sh pgadmin

down-pgadmin:
	@./scripts/down-service.sh pgadmin
