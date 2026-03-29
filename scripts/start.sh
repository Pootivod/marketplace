#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

"${ROOT_DIR}/scripts/up-service.sh" users-api
"${ROOT_DIR}/scripts/up-service.sh" gateway-api
"${ROOT_DIR}/scripts/up-service.sh" web

echo
echo "All main services are up."
echo "Useful port-forward commands:"
echo "kubectl port-forward -n marketplace svc/web 3000:80"
echo "kubectl port-forward -n marketplace svc/gateway-api 8080:8080"
echo "kubectl port-forward -n marketplace svc/keycloak 8081:8080"
echo "kubectl port-forward -n marketplace svc/users-api 8082:8082"
echo "kubectl port-forward -n marketplace svc/pgadmin 5050:80"
