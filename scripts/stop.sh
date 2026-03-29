#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MINIKUBE_PROFILE="${MINIKUBE_PROFILE:-minikube}"

"${ROOT_DIR}/scripts/down-service.sh" web || true
"${ROOT_DIR}/scripts/down-service.sh" gateway-api || true
"${ROOT_DIR}/scripts/down-service.sh" users-api || true
"${ROOT_DIR}/scripts/down-service.sh" keycloak || true
"${ROOT_DIR}/scripts/down-service.sh" postgres-users || true
"${ROOT_DIR}/scripts/down-service.sh" postgres-keycloak || true
"${ROOT_DIR}/scripts/down-service.sh" pgadmin || true

echo "Stopping Minikube profile: ${MINIKUBE_PROFILE}"
minikube stop -p "${MINIKUBE_PROFILE}"

echo "All services are down"
