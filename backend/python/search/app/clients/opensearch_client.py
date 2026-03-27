from __future__ import annotations

from typing import Any, Iterable

from opensearchpy import OpenSearch, RequestsHttpConnection, helpers

from app.core.config import settings


class OpenSearchClient:
    def __init__(self) -> None:
        auth = None
        if settings.opensearch_username and settings.opensearch_password:
            auth = (settings.opensearch_username, settings.opensearch_password)

        self.client = OpenSearch(
            hosts=[{
                "host": settings.opensearch_host,
                "port": settings.opensearch_port,
            }],
            http_auth=auth,
            use_ssl=settings.opensearch_scheme == "https",
            verify_certs=settings.opensearch_verify_certs,
            connection_class=RequestsHttpConnection,
        )
        self.index_name = settings.opensearch_index

    def ensure_index(self) -> None:
        if self.client.indices.exists(index=self.index_name):
            return

        mapping = {
            "settings": {
                "index": {"number_of_shards": 1, "number_of_replicas": 0}
            },
            "mappings": {
                "properties": {
                    "id": {"type": "keyword"},
                    "title": {"type": "text"},
                    "description": {"type": "text"},
                    "brand": {
                        "type": "text",
                        "fields": {"keyword": {"type": "keyword"}},
                    },
                    "category_id": {"type": "keyword"},
                    "category_name": {
                        "type": "text",
                        "fields": {"keyword": {"type": "keyword"}},
                    },
                    "price": {"type": "float"},
                    "currency": {"type": "keyword"},
                    "rating": {"type": "float"},
                    "review_count": {"type": "integer"},
                    "is_available": {"type": "boolean"},
                    "stock": {"type": "integer"},
                    "image_url": {"type": "keyword"},
                    "popularity_score": {"type": "float"},
                    "attributes": {"type": "object", "enabled": True},
                    "attributes_text": {"type": "text"},
                    "updated_at": {"type": "date"},
                }
            },
        }
        self.client.indices.create(index=self.index_name, body=mapping)

    def bulk_upsert(self, documents: Iterable[dict[str, Any]]) -> tuple[int, list[Any]]:
        actions = [
            {
                "_op_type": "index",
                "_index": self.index_name,
                "_id": doc["id"],
                "_source": doc,
            }
            for doc in documents
        ]
        if not actions:
            return 0, []
        return helpers.bulk(self.client, actions, refresh=True)

    def delete_document(self, document_id: str) -> None:
        self.client.delete(index=self.index_name, id=document_id, ignore=[404], refresh=True)

    def count_documents(self) -> int:
        response = self.client.count(index=self.index_name)
        return int(response.get("count", 0))

    def search(self, body: dict[str, Any]) -> dict[str, Any]:
        return self.client.search(index=self.index_name, body=body)
