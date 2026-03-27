#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

IMAGE_NAME="${IMAGE_NAME:-marketplace-search-api:local}"
CONTAINER_NAME="${CONTAINER_NAME:-marketplace-search-api}"
SEARCH_PORT="${SEARCH_PORT:-8082}"

GOODS_API_BASE_URL="${GOODS_API_BASE_URL:-http://host.docker.internal:8080}"
OPENSEARCH_URL="${OPENSEARCH_URL:-http://host.docker.internal:9200}"
SYNC_INTERVAL_SECONDS="${SYNC_INTERVAL_SECONDS:-600}"
INDEX_NAME="${INDEX_NAME:-goods_search_v1}"
LOG_LEVEL="${LOG_LEVEL:-INFO}"

docker build \
  -f "${ROOT_DIR}/backend/python/search/Dockerfile" \
  -t "${IMAGE_NAME}" \
  "${ROOT_DIR}/backend/python/search"

if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}\$"; then
  docker rm -f "${CONTAINER_NAME}"
fi

docker run -d \
  --restart unless-stopped \
  --name "${CONTAINER_NAME}" \
  -p "${SEARCH_PORT}:8000" \
  -e GOODS_API_BASE_URL="${GOODS_API_BASE_URL}" \
  -e OPENSEARCH_URL="${OPENSEARCH_URL}" \
  -e SYNC_INTERVAL_SECONDS="${SYNC_INTERVAL_SECONDS}" \
  -e INDEX_NAME="${INDEX_NAME}" \
  -e LOG_LEVEL="${LOG_LEVEL}" \
  "${IMAGE_NAME}"

echo "search-api is available at: http://localhost:${SEARCH_PORT}"