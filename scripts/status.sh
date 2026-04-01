#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "${ROOT_DIR}/scripts/common.sh"
ensure_base_deps
ns="$(namespace_name)"
helm status "$(release_name)" -n "${ns}"
