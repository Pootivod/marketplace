#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
K8S_DIR="${K8S_DIR:-${ROOT_DIR}/deploy/k8s}"

usage() {
  echo "Usage: $0 <postgres-users|postgres-keycloak|keycloak|users-api|gateway-api|web|pgadmin>"
  exit 1
}

main() {
  [[ $# -eq 1 ]] || usage
  local service="$1"
  local path="${K8S_DIR}/${service}"

  if [[ ! -d "${path}" ]]; then
    echo "Manifest directory not found: ${path}"
    exit 1
  fi

  kubectl delete -f "${path}" --ignore-not-found=true
  echo "Service '${service}' is down"
}

main "$@"
