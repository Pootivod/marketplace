from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.clients.goods_api_client import GoodsApiClient
from app.clients.opensearch_client import OpenSearchClient
from app.core.config import settings
from app.services.background_sync import BackgroundSyncRunner
from app.services.search_service import SearchService
from app.services.sync_service import SyncService
from app.services.sync_state_service import SyncStateService

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger(__name__)

opensearch_client = OpenSearchClient()
goods_api_client = GoodsApiClient()
sync_state_service = SyncStateService()
sync_service = SyncService(
    goods_api_client=goods_api_client,
    opensearch_client=opensearch_client,
    sync_state_service=sync_state_service,
)
search_service = SearchService(opensearch_client=opensearch_client)
background_runner = BackgroundSyncRunner(sync_service=sync_service)


def get_sync_service() -> SyncService:
    return sync_service



def get_search_service() -> SearchService:
    return search_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Ensuring OpenSearch index")
    sync_service.ensure_index()

    if settings.run_full_sync_on_startup:
        try:
            if settings.force_full_sync_on_startup or opensearch_client.count_documents() == 0:
                logger.info("Running full sync on startup")
                sync_service.full_sync()
            else:
                logger.info("Running incremental sync on startup")
                sync_service.incremental_sync()
        except Exception:
            logger.exception("Startup sync failed")

    background_runner.start()
    yield
    background_runner.stop()


app = FastAPI(title=settings.app_name, lifespan=lifespan)

from app.api.routes import router  # noqa: E402

app.include_router(router)
