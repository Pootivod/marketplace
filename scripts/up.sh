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

if [[ "${BUILD:-0}" == "1" ]]; then
  if [[ -n "${SERVICE:-}" ]]; then
    ENV="${ENV}" SERVICE="${SERVICE}" TAG="${TAG:-}" "${ROOT_DIR}/scripts/build.sh"
  else
    ENV="${ENV}" TAG="${TAG:-}" "${ROOT_DIR}/scripts/build.sh"
  fi
fi

if [[ -n "${SERVICE:-}" ]]; then
  echo ">>> Deploying service '${SERVICE}' to namespace '${ns}'"
  helm upgrade --install "${release}" "${CHART_DIR}" \
    -n "${ns}" --create-namespace \
    "${values_args[@]}" \
    --set "services.${SERVICE}.enabled=true" \
    ${TAG:+--set-string global.image.tag="${TAG}"}

  if service_exists_in_cluster "${SERVICE}" "${ns}"; then
    echo ">>> Restarting deployment/${SERVICE}"
    kubectl -n "${ns}" rollout restart "deployment/${SERVICE}" >/dev/null 2>&1 || true
  fi
else
  echo ">>> Deploying all enabled services to namespace '${ns}'"
  helm upgrade --install "${release}" "${CHART_DIR}" \
    -n "${ns}" --create-namespace \
    "${values_args[@]}" \
    ${TAG:+--set-string global.image.tag="${TAG}"}
fi
