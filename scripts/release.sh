#!/usr/bin/env bash
set -euo pipefail

if [[ $# -gt 0 ]]; then
  PORTS=("$@")
else
  PORTS=(3000 5050 8080 8081 8082)
fi

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing dependency: $1"
    exit 1
  fi
}

kill_port_processes() {
  local port="$1"

  mapfile -t pids < <(lsof -ti TCP:"${port}" -sTCP:LISTEN 2>/dev/null | sort -u || true)

  if [[ ${#pids[@]} -eq 0 ]]; then
    echo "Port ${port}: free"
    return
  fi

  echo "Port ${port}: busy"
  for pid in "${pids[@]}"; do
    local cmd
    cmd="$(ps -p "${pid}" -o command= 2>/dev/null | sed 's/^[[:space:]]*//')"
    echo "  Killing PID ${pid} (${cmd:-unknown})"
    kill "${pid}" 2>/dev/null || true
  done

  sleep 1

  mapfile -t remaining_pids < <(lsof -ti TCP:"${port}" -sTCP:LISTEN 2>/dev/null | sort -u || true)
  for pid in "${remaining_pids[@]:-}"; do
    [[ -n "${pid}" ]] || continue
    echo "  Force killing PID ${pid}"
    kill -9 "${pid}" 2>/dev/null || true
  done

  if lsof -ti TCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "  Failed to fully release port ${port}"
    exit 1
  fi

  echo "Port ${port}: released"
}

main() {
  require_cmd lsof
  require_cmd ps
  require_cmd kill

  echo "Releasing ports: ${PORTS[*]}"
  for port in "${PORTS[@]}"; do
    kill_port_processes "${port}"
  done

  echo "Done"
}

main "$@"
