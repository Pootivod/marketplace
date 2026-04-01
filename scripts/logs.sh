#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "${ROOT_DIR}/scripts/common.sh"

ensure_base_deps
[[ -n "${SERVICE:-}" ]] || { echo "SERVICE is required" >&2; exit 1; }
ns="$(namespace_name)"
tail_n="${TAIL:-200}"

kubectl logs -n "${ns}" "deployment/${SERVICE}" --tail="${tail_n}" -f
