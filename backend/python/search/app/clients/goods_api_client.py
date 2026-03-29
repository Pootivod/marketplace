from __future__ import annotations

from datetime import datetime
from typing import Any

import requests

from app.core.config import settings


class GoodsApiClient:
    def __init__(self) -> None:
        self.base_url = settings.goods_api_base_url.rstrip("/")
        self.timeout = settings.goods_api_timeout_seconds

    def fetch_all_goods(self) -> list[dict[str, Any]]:
        response = requests.get(
            f"{self.base_url}{settings.goods_all_endpoint}",
            timeout=self.timeout,
        )
        response.raise_for_status()
        data = response.json()
        if isinstance(data, list):
            return data
        if isinstance(data, dict) and "items" in data and isinstance(data["items"], list):
            return data["items"]
        raise ValueError("Unexpected response format from goods all endpoint")

    def fetch_goods_updated_after(self, updated_after: str | None, page: int = 0, size: int | None = None) -> list[dict[str, Any]]:
        if not updated_after:
            return self.fetch_all_goods()

        params = {
            "updatedAfter": updated_after,
            "page": page,
            "size": size or settings.goods_sync_batch_size,
        }
        response = requests.get(
            f"{self.base_url}{settings.goods_sync_endpoint}",
            params=params,
            timeout=self.timeout,
        )

        if response.status_code == 404:
            return self.fetch_all_goods()

        response.raise_for_status()
        data = response.json()
        if isinstance(data, list):
            return data
        if isinstance(data, dict):
            if isinstance(data.get("items"), list):
                return data["items"]
            if isinstance(data.get("content"), list):
                return data["content"]
        raise ValueError("Unexpected response format from goods sync endpoint")
