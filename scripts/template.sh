#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "${ROOT_DIR}/scripts/common.sh"

ensure_base_deps
ns="$(namespace_name)"
release="$(release_name)"
values_args=()
for f in "${VALUES_FILES[@]}"; do
  values_args+=(-f "$f")
done

helm template "${release}" "${CHART_DIR}" \
  -n "${ns}" \
  "${values_args[@]}" \
  ${TAG:+--set-string global.image.tag="${TAG}"}
