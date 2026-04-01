#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHART_DIR="${ROOT_DIR}/deploy/helm/marketplace"
ENV="${ENV:-dev}"
VALUES_FILES=("${CHART_DIR}/values.yaml")
if [[ -f "${CHART_DIR}/values-${ENV}.yaml" ]]; then
  VALUES_FILES+=("${CHART_DIR}/values-${ENV}.yaml")
fi

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "Missing command: $1" >&2; exit 1; }
}

ensure_values_files() {
  [[ -f "${CHART_DIR}/values.yaml" ]] || { echo "Missing ${CHART_DIR}/values.yaml" >&2; exit 1; }
}

ensure_values_tooling() {
  need_cmd python3
  [[ -f "${ROOT_DIR}/scripts/values.py" ]] || { echo "Missing scripts/values.py" >&2; exit 1; }
}

ensure_k8s_deps() {
  need_cmd helm
  need_cmd kubectl
}

ensure_minikube_dep() {
  need_cmd minikube
}

ensure_build_deps() {
  need_cmd docker
  ensure_minikube_dep
}

ensure_base_deps() {
  ensure_values_files
  ensure_values_tooling
  ensure_k8s_deps
}

values_cmd() {
  local args=()
  for f in "${VALUES_FILES[@]}"; do
    args+=(--file "$f")
  done
  python3 "${ROOT_DIR}/scripts/values.py" "${args[@]}" "$@"
}

get_merged_value() {
  local path="$1"
  local def="${2:-}"
  values_cmd get "$path" --default "$def"
}

get_service_value() {
  local service="$1"
  local path="$2"
  local def="${3:-}"
  values_cmd service-get "$service" "$path" --default "$def"
}

release_name() {
  get_merged_value "global.releaseName" "marketplace"
}

namespace_name() {
  if [[ -n "${NAMESPACE:-}" ]]; then
    echo "${NAMESPACE}"
  else
    get_merged_value "global.namespace.name" "marketplace"
  fi
}

image_tag() {
  if [[ -n "${TAG:-}" ]]; then
    echo "${TAG}"
  else
    get_merged_value "global.image.tag" "latest"
  fi
}

image_ref() {
  local service="$1"
  local registry image_name tag
  registry="$(get_merged_value "global.image.registry" "")"
  image_name="$(get_service_value "$service" "imageName" "$service")"
  tag="$(image_tag)"
  if [[ -n "$registry" ]]; then
    printf "%s/%s:%s\n" "$registry" "$image_name" "$tag"
  else
    printf "%s:%s\n" "$image_name" "$tag"
  fi
}

enabled_services() {
  values_cmd enabled-services
}

all_services() {
  values_cmd all-services
}

helm_values_args() {
  local out=()
  for f in "${VALUES_FILES[@]}"; do
    out+=(-f "$f")
  done
  printf '%q ' "${out[@]}"
}

service_exists_in_cluster() {
  local service="$1" ns="$2"
  kubectl -n "$ns" get deployment "$service" >/dev/null 2>&1
}
