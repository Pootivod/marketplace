from __future__ import annotations

from contextlib import contextmanager
from datetime import datetime, timezone
from threading import Lock
from typing import Any, Iterator

from app.clients.goods_api_client import GoodsApiClient
from app.clients.opensearch_client import OpenSearchClient
from app.services.sync_state_service import SyncStateService
from app.utils.mapping import map_goods_to_search_document


class SyncService:
    def __init__(
        self,
        goods_api_client: GoodsApiClient,
        opensearch_client: OpenSearchClient,
        sync_state_service: SyncStateService,
    ) -> None:
        self.goods_api_client = goods_api_client
        self.opensearch_client = opensearch_client
        self.sync_state_service = sync_state_service
        self._lock = Lock()

    def get_status(self) -> dict[str, Any]:
        return self.sync_state_service.load()

    def ensure_index(self) -> None:
        self.opensearch_client.ensure_index()

    @contextmanager
    def _sync_guard(self, mode: str) -> Iterator[None]:
        self._lock.acquire()
        self.sync_state_service.patch(is_sync_running=True, last_mode=mode)
        try:
            yield
        finally:
            self.sync_state_service.patch(is_sync_running=False)
            self._lock.release()

    def full_sync(self) -> dict[str, Any]:
        with self._sync_guard(mode="full"):
            self.ensure_index()
            goods = self.goods_api_client.fetch_all_goods()
            documents = [map_goods_to_search_document(item).to_opensearch() for item in goods if item.get("id") is not None]
            indexed_count, _ = self.opensearch_client.bulk_upsert(documents)
            now = _utc_now_iso()
            self.sync_state_service.patch(
                last_successful_sync_at=now,
                last_full_sync_at=now,
                last_mode="full",
            )
            return {
                "mode": "full",
                "fetched": len(goods),
                "indexed": indexed_count,
                "synced_at": now,
            }

    def incremental_sync(self) -> dict[str, Any]:
        with self._sync_guard(mode="incremental"):
            self.ensure_index()
            state = self.sync_state_service.load()
            updated_after = state.get("last_successful_sync_at")
            goods = self.goods_api_client.fetch_goods_updated_after(updated_after)
            documents = [map_goods_to_search_document(item).to_opensearch() for item in goods if item.get("id") is not None]
            indexed_count, _ = self.opensearch_client.bulk_upsert(documents)
            now = _utc_now_iso()
            self.sync_state_service.patch(
                last_successful_sync_at=now,
                last_mode="incremental",
            )
            return {
                "mode": "incremental",
                "updated_after": updated_after,
                "fetched": len(goods),
                "indexed": indexed_count,
                "synced_at": now,
            }



def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
