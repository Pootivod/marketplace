from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query

from app.schemas.search import SearchItem, SearchResponse, SyncStatusResponse
from app.services.search_service import SearchService
from app.services.sync_service import SyncService
from app.main import get_search_service, get_sync_service

router = APIRouter()


@router.get("/api/v1/search", response_model=SearchResponse)
def search_goods(
    q: str | None = Query(default=None),
    page: int = Query(default=0, ge=0),
    size: int = Query(default=20, ge=1, le=100),
    sort: str = Query(default="relevance"),
    categoryId: str | None = Query(default=None),
    minPrice: float | None = Query(default=None, ge=0),
    maxPrice: float | None = Query(default=None, ge=0),
    inStock: bool | None = Query(default=None),
    search_service: SearchService = Depends(get_search_service),
) -> SearchResponse:
    raw = search_service.search(
        q=q,
        page=page,
        size=size,
        sort=sort,
        category_id=categoryId,
        min_price=minPrice,
        max_price=maxPrice,
        in_stock=inStock,
    )
    hits = raw.get("hits", {})
    total_value = hits.get("total", {})
    if isinstance(total_value, dict):
        total = int(total_value.get("value", 0))
    else:
        total = int(total_value or 0)

    items = [
        SearchItem(
            id=hit["_source"].get("id"),
            title=hit["_source"].get("title", ""),
            description=hit["_source"].get("description", ""),
            brand=hit["_source"].get("brand", ""),
            category_name=hit["_source"].get("category_name", ""),
            price=hit["_source"].get("price"),
            currency=hit["_source"].get("currency", "USD"),
            rating=hit["_source"].get("rating", 0.0),
            review_count=hit["_source"].get("review_count", 0),
            is_available=hit["_source"].get("is_available", True),
            stock=hit["_source"].get("stock", 0),
            image_url=hit["_source"].get("image_url", ""),
            score=hit.get("_score"),
        )
        for hit in hits.get("hits", [])
    ]
    return SearchResponse(items=items, page=page, size=size, total=total)


@router.post("/internal/sync/full")
def full_sync(sync_service: SyncService = Depends(get_sync_service)) -> dict:
    return sync_service.full_sync()


@router.post("/internal/sync/incremental")
def incremental_sync(sync_service: SyncService = Depends(get_sync_service)) -> dict:
    return sync_service.incremental_sync()


@router.get("/internal/sync/status", response_model=SyncStatusResponse)
def sync_status(sync_service: SyncService = Depends(get_sync_service)) -> SyncStatusResponse:
    return SyncStatusResponse(**sync_service.get_status())
