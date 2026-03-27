from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass
class SearchDocument:
    id: str
    title: str
    description: str = ""
    brand: str = ""
    category_id: str | None = None
    category_name: str = ""
    price: float | None = None
    currency: str = "USD"
    rating: float = 0.0
    review_count: int = 0
    is_available: bool = True
    stock: int = 0
    image_url: str = ""
    popularity_score: float = 0.0
    attributes: dict[str, Any] = field(default_factory=dict)
    attributes_text: str = ""
    updated_at: str | None = None

    def to_opensearch(self) -> dict[str, Any]:
        payload = {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "brand": self.brand,
            "category_id": self.category_id,
            "category_name": self.category_name,
            "price": self.price,
            "currency": self.currency,
            "rating": self.rating,
            "review_count": self.review_count,
            "is_available": self.is_available,
            "stock": self.stock,
            "image_url": self.image_url,
            "popularity_score": self.popularity_score,
            "attributes": self.attributes,
            "attributes_text": self.attributes_text,
            "updated_at": self.updated_at or datetime.utcnow().isoformat() + "Z",
        }
        return payload
