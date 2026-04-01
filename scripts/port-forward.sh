#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "${ROOT_DIR}/scripts/common.sh"

ensure_base_deps
[[ -n "${SERVICE:-}" ]] || { echo "SERVICE is required" >&2; exit 1; }
ns="$(namespace_name)"
remote_port="$(get_service_value "${SERVICE}" "service.port" "8080")"
local_port="${LOCAL_PORT:-$remote_port}"

echo ">>> Forwarding localhost:${local_port} -> service/${SERVICE}:${remote_port}"
kubectl -n "${ns}" port-forward "service/${SERVICE}" "${local_port}:${remote_port}"
