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

if [[ -n "${SERVICE:-}" ]]; then
  echo ">>> Disabling service '${SERVICE}' in namespace '${ns}'"
  helm upgrade --install "${release}" "${CHART_DIR}" \
    -n "${ns}" --create-namespace \
    "${values_args[@]}" \
    --set "services.${SERVICE}.enabled=false" \
    ${TAG:+--set-string global.image.tag="${TAG}"}
else
  echo ">>> Uninstalling release '${release}' from namespace '${ns}'"
  helm uninstall "${release}" -n "${ns}" || true
fi
