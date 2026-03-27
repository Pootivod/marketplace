from __future__ import annotations

from typing import Any

from app.clients.opensearch_client import OpenSearchClient


class SearchService:
    def __init__(self, opensearch_client: OpenSearchClient) -> None:
        self.opensearch_client = opensearch_client

    def search(
        self,
        q: str | None,
        page: int,
        size: int,
        sort: str,
        category_id: str | None,
        min_price: float | None,
        max_price: float | None,
        in_stock: bool | None,
    ) -> dict[str, Any]:
        query_text = (q or "").strip()
        filters: list[dict[str, Any]] = []

        if category_id:
            filters.append({"term": {"category_id": category_id}})
        if min_price is not None or max_price is not None:
            range_payload: dict[str, float] = {}
            if min_price is not None:
                range_payload["gte"] = min_price
            if max_price is not None:
                range_payload["lte"] = max_price
            filters.append({"range": {"price": range_payload}})
        if in_stock is not None:
            filters.append({"term": {"is_available": in_stock}})

        query_clause: dict[str, Any]
        if query_text:
            query_clause = {
                "function_score": {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "multi_match": {
                                        "query": query_text,
                                        "fields": [
                                            "title^5",
                                            "brand^4",
                                            "category_name^2",
                                            "attributes_text^2",
                                            "description",
                                        ],
                                        "type": "best_fields",
                                        "fuzziness": "AUTO",
                                    }
                                }
                            ],
                            "filter": filters,
                        }
                    },
                    "functions": [
                        {
                            "field_value_factor": {
                                "field": "popularity_score",
                                "factor": 1.2,
                                "missing": 0,
                            }
                        },
                        {
                            "field_value_factor": {
                                "field": "rating",
                                "factor": 0.3,
                                "missing": 0,
                            }
                        },
                        {
                            "filter": {"term": {"is_available": True}},
                            "weight": 2,
                        },
                    ],
                    "score_mode": "sum",
                    "boost_mode": "sum",
                }
            }
        else:
            query_clause = {"bool": {"must": [{"match_all": {}}], "filter": filters}}

        sort_clause: list[Any]
        if sort == "price_asc":
            sort_clause = [{"price": {"order": "asc"}}, {"_score": {"order": "desc"}}]
        elif sort == "price_desc":
            sort_clause = [{"price": {"order": "desc"}}, {"_score": {"order": "desc"}}]
        elif sort == "rating_desc":
            sort_clause = [{"rating": {"order": "desc"}}, {"_score": {"order": "desc"}}]
        elif sort == "newest":
            sort_clause = [{"updated_at": {"order": "desc"}}, {"_score": {"order": "desc"}}]
        else:
            sort_clause = [{"_score": {"order": "desc"}}, {"updated_at": {"order": "desc"}}]

        body = {
            "from": page * size,
            "size": size,
            "query": query_clause,
            "sort": sort_clause,
        }
        return self.opensearch_client.search(body)
