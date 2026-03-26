#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

IMAGE_NAME="${IMAGE_NAME:-marketplace-web:local}"
CONTAINER_NAME="${CONTAINER_NAME:-marketplace-web}"
WEB_PORT="${WEB_PORT:-3000}"

VITE_API_BASE_URL="${VITE_API_BASE_URL:-http://localhost:8080}"
VITE_DEBUG_FALLBACK="${VITE_DEBUG_FALLBACK:-true}"

docker build \
  -f "${ROOT_DIR}/frontend/web/Dockerfile" \
  --build-arg VITE_API_BASE_URL="${VITE_API_BASE_URL}" \
  --build-arg VITE_DEBUG_FALLBACK="${VITE_DEBUG_FALLBACK}" \
  -t "${IMAGE_NAME}" \
  "${ROOT_DIR}/frontend/web"

if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}\$"; then
  docker rm -f "${CONTAINER_NAME}"
fi

docker run -d \
  --name "${CONTAINER_NAME}" \
  -p "${WEB_PORT}:80" \
  "${IMAGE_NAME}"

echo "Web is available at: http://localhost:${WEB_PORT}"