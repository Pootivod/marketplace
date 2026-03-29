from __future__ import annotations

from pydantic import BaseModel, Field


class SearchItem(BaseModel):
    id: str
    title: str
    description: str = ""
    brand: str = ""
    category_name: str = ""
    price: float | None = None
    currency: str = "USD"
    rating: float = 0.0
    review_count: int = 0
    is_available: bool = True
    stock: int = 0
    image_url: str = ""
    score: float | None = None


class SearchResponse(BaseModel):
    items: list[SearchItem]
    page: int
    size: int
    total: int


class SyncStatusResponse(BaseModel):
    last_successful_sync_at: str | None = None
    last_full_sync_at: str | None = None
    last_mode: str | None = None
    is_sync_running: bool = False
