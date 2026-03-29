#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

JAVA_ROOT="${JAVA_ROOT:-${ROOT_DIR}/backend/java}"
WEB_DIR="${WEB_DIR:-${ROOT_DIR}/frontend/web}"
K8S_DIR="${K8S_DIR:-${ROOT_DIR}/deploy/k8s}"

NAMESPACE="${NAMESPACE:-marketplace}"
MINIKUBE_PROFILE="${MINIKUBE_PROFILE:-minikube}"

WEB_IMAGE_NAME="${WEB_IMAGE_NAME:-marketplace/web:local}"

usage() {
  echo "Usage: $0 <postgres-users|postgres-keycloak|keycloak|users-api|gateway-api|web|pgadmin>"
  exit 1
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing dependency: $1"
    exit 1
  fi
}

have_maven() {
  [[ -x "${JAVA_ROOT}/mvnw" ]] || command -v mvn >/dev/null 2>&1
}

mvn_cmd() {
  if [[ -x "${JAVA_ROOT}/mvnw" ]]; then
    echo "${JAVA_ROOT}/mvnw"
  else
    echo "mvn"
  fi
}

check_base_dependencies() {
  require_cmd minikube
  require_cmd kubectl
  require_cmd docker
}

check_java_dependencies() {
  if ! have_maven; then
    echo "Missing dependency: ${JAVA_ROOT}/mvnw or mvn"
    exit 1
  fi
}

ensure_minikube_running() {
  local status
  status="$(minikube status -p "${MINIKUBE_PROFILE}" --format='{{.Host}}' 2>/dev/null || true)"

  if [[ "${status}" != "Running" ]]; then
    echo "Starting Minikube profile: ${MINIKUBE_PROFILE}"
    minikube start -p "${MINIKUBE_PROFILE}"
  fi

  echo "Enabling Ingress addon"
  minikube -p "${MINIKUBE_PROFILE}" addons enable ingress >/dev/null
}

use_minikube_docker() {
  eval "$(minikube -p "${MINIKUBE_PROFILE}" docker-env --shell bash)"
}

ensure_namespace() {
  if [[ -f "${K8S_DIR}/base/namespace.yaml" ]]; then
    kubectl apply -f "${K8S_DIR}/base/namespace.yaml"
  else
    kubectl get namespace "${NAMESPACE}" >/dev/null 2>&1 || kubectl create namespace "${NAMESPACE}"
  fi
}

apply_dir() {
  local dir="$1"

  if [[ ! -d "${dir}" ]]; then
    echo "Manifest directory not found: ${dir}"
    exit 1
  fi

  kubectl apply -f "${dir}"
}

build_java_module() {
  local module_name="$1"
  local cmd
  cmd="$(mvn_cmd)"

  echo "Building Java module via Jib: ${module_name}"
  "${cmd}" \
    -f "${JAVA_ROOT}/pom.xml" \
    -pl "${module_name}" \
    -am \
    -DskipTests \
    package \
    jib:dockerBuild
}

build_web() {
  if [[ ! -d "${WEB_DIR}" ]]; then
    echo "Web directory not found: ${WEB_DIR}"
    exit 1
  fi

  echo "Building web image: ${WEB_IMAGE_NAME}"
  docker build -t "${WEB_IMAGE_NAME}" "${WEB_DIR}"
}

wait_rollout() {
  local service="$1"

  case "${service}" in
    postgres-users|postgres-keycloak)
      kubectl rollout status statefulset/"${service}" -n "${NAMESPACE}" --timeout=180s
      ;;
    keycloak|users-api|gateway-api|web|pgadmin)
      kubectl rollout status deployment/"${service}" -n "${NAMESPACE}" --timeout=180s
      ;;
    *)
      echo "Unknown rollout kind for service: ${service}"
      exit 1
      ;;
  esac
}

up_postgres_users() {
  apply_dir "${K8S_DIR}/postgres-users"
  wait_rollout "postgres-users"
}

up_postgres_keycloak() {
  apply_dir "${K8S_DIR}/postgres-keycloak"
  wait_rollout "postgres-keycloak"
}

up_keycloak() {
  up_postgres_keycloak
  apply_dir "${K8S_DIR}/keycloak"
  wait_rollout "keycloak"
}

up_users_api() {
  check_java_dependencies
  up_postgres_users
  up_keycloak
  up_pgadmin
  build_java_module "users-api"
  apply_dir "${K8S_DIR}/users-api"
  wait_rollout "users-api"
}

up_gateway_api() {
  check_java_dependencies
  up_keycloak
  build_java_module "gateway-api"
  apply_dir "${K8S_DIR}/gateway-api"
  wait_rollout "gateway-api"
}

up_web() {
  build_web
  apply_dir "${K8S_DIR}/web"
  wait_rollout "web"
}

up_pgadmin() {
  up_postgres_users
  apply_dir "${K8S_DIR}/pgadmin"
  wait_rollout "pgadmin"
}

main() {
  [[ $# -eq 1 ]] || usage
  local service="$1"

  check_base_dependencies
  ensure_minikube_running
  use_minikube_docker
  ensure_namespace

  case "${service}" in
    postgres-users)
      up_postgres_users
      ;;
    postgres-keycloak)
      up_postgres_keycloak
      ;;
    keycloak)
      up_keycloak
      ;;
    users-api)
      up_users_api
      ;;
    gateway-api)
      up_gateway_api
      ;;
    web)
      up_web
      ;;
    pgadmin)
      up_pgadmin
      ;;
    *)
      usage
      ;;
  esac

  echo "Service '${service}' is up"
}

main "$@"
