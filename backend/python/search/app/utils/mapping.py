from __future__ import annotations

from typing import Any

from app.models.search_document import SearchDocument



def _extract_attributes_text(attributes: Any) -> str:
    if isinstance(attributes, dict):
        parts: list[str] = []
        for key, value in attributes.items():
            parts.append(str(key))
            if isinstance(value, (list, tuple)):
                parts.extend(str(v) for v in value)
            else:
                parts.append(str(value))
        return " ".join(parts)
    if isinstance(attributes, list):
        return " ".join(str(item) for item in attributes)
    return ""



def map_goods_to_search_document(goods: dict[str, Any]) -> SearchDocument:
    category = goods.get("category") or {}
    brand = goods.get("brand") or {}
    attributes = goods.get("attributes") or {}

    return SearchDocument(
        id=str(goods.get("id")),
        title=goods.get("title") or goods.get("name") or "",
        description=goods.get("description") or "",
        brand=brand.get("name") if isinstance(brand, dict) else str(brand or ""),
        category_id=(str(category.get("id")) if isinstance(category, dict) and category.get("id") is not None else None),
        category_name=category.get("name") if isinstance(category, dict) else str(category or ""),
        price=float(goods.get("price")) if goods.get("price") is not None else None,
        currency=goods.get("currency") or "USD",
        rating=float(goods.get("rating") or 0.0),
        review_count=int(goods.get("reviewCount") or goods.get("review_count") or 0),
        is_available=bool(goods.get("isAvailable", goods.get("is_available", True))),
        stock=int(goods.get("stock") or 0),
        image_url=goods.get("imageUrl") or goods.get("image_url") or "",
        popularity_score=float(goods.get("popularityScore") or goods.get("popularity_score") or 0.0),
        attributes=attributes if isinstance(attributes, dict) else {"raw": attributes},
        attributes_text=goods.get("attributesText") or goods.get("attributes_text") or _extract_attributes_text(attributes),
        updated_at=goods.get("updatedAt") or goods.get("updated_at"),
    )
