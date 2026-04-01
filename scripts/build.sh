#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "${ROOT_DIR}/scripts/common.sh"

ensure_values_files
ensure_values_tooling
ensure_build_deps

build_one() {
  local service="$1"
  local build_type image_ref_v image_name module tar_path context
  build_type="$(get_service_value "$service" "build.type" "")"
  image_name="$(get_service_value "$service" "imageName" "$service")"
  image_ref_v="$(image_ref "$service")"

  case "$build_type" in
    java)
      need_cmd mvn
      module="$(get_service_value "$service" "build.module" "$service")"
      tar_path="${ROOT_DIR}/backend/java/target/images/${module}.tar"
      echo ">>> Building Java service '${service}' as ${image_ref_v}"
      mvn -f "${ROOT_DIR}/backend/java/pom.xml" -pl "${module}" -am clean package jib:buildTar
      docker image load -i "${tar_path}" >/dev/null
      if [[ "${image_ref_v}" != "${image_name}:$(image_tag)" ]]; then
        docker tag "${image_name}:$(image_tag)" "${image_ref_v}"
      fi
      minikube image load "${image_ref_v}"
      ;;
    docker)
      context="$(get_service_value "$service" "build.context" "")"
      [[ -n "${context}" ]] || { echo "Missing build.context for ${service}" >&2; exit 1; }
      echo ">>> Building Dockerfile service '${service}' as ${image_ref_v}"
      docker build -t "${image_ref_v}" "${ROOT_DIR}/${context}"
      minikube image load "${image_ref_v}"
      ;;
    *)
      echo "Unsupported or missing build.type for service '${service}'" >&2
      exit 1
      ;;
  esac
  echo ">>> Loaded into minikube: ${image_ref_v}"
}

if [[ -n "${SERVICE:-}" ]]; then
  build_one "${SERVICE}"
else
  while IFS= read -r service; do
    [[ -n "$service" ]] || continue
    build_one "$service"
  done < <(enabled_services)
fi
