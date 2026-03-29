#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="${NAMESPACE:-marketplace}"
PIDS=()

cleanup() {
  echo
  echo "Stopping port-forwards..."
  for pid in "${PIDS[@]:-}"; do
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill "$pid" >/dev/null 2>&1 || true
    fi
  done
  wait || true
}

trap cleanup EXIT INT TERM

start_pf() {
  local name="$1"
  local resource="$2"
  local local_port="$3"
  local remote_port="$4"

  echo "Starting port-forward for ${name}: localhost:${local_port} -> ${resource}:${remote_port}"

  kubectl port-forward \
    -n "${NAMESPACE}" \
    "${resource}" \
    "${local_port}:${remote_port}" \
    >/tmp/"${name}".log 2>&1 &

  PIDS+=("$!")
}

start_pf "web" "svc/web" 3000 80
start_pf "gateway-api" "svc/gateway-api" 8080 8080
start_pf "keycloak" "svc/keycloak" 8081 8080
start_pf "users-api" "svc/users-api" 8082 8082
start_pf "pgadmin" "svc/pgadmin" 5050 80

sleep 2

for name in web gateway-api keycloak users-api pgadmin; do
  echo "---- ${name} log ----"
  cat "/tmp/${name}.log" || true
done

echo
echo "Active port-forwards:"
echo "  web         -> http://localhost:3000"
echo "  gateway-api -> http://localhost:8080"
echo "  keycloak    -> http://localhost:8081"
echo "  users-api   -> http://localhost:8082"
echo "  pgadmin     -> http://localhost:5050"
echo
echo "Press Ctrl+C to stop all."

wait "${PIDS[@]}"