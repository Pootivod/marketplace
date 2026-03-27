from __future__ import annotations

import logging
import threading
import time

from app.core.config import settings
from app.services.sync_service import SyncService

logger = logging.getLogger(__name__)


class BackgroundSyncRunner:
    def __init__(self, sync_service: SyncService) -> None:
        self.sync_service = sync_service
        self._stop_event = threading.Event()
        self._thread: threading.Thread | None = None

    def start(self) -> None:
        if self._thread and self._thread.is_alive():
            return
        self._thread = threading.Thread(target=self._run_loop, name="background-sync", daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._stop_event.set()
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=5)

    def _run_loop(self) -> None:
        while not self._stop_event.is_set():
            interrupted = self._stop_event.wait(settings.sync_interval_seconds)
            if interrupted:
                return
            try:
                logger.info("Starting scheduled incremental sync")
                self.sync_service.incremental_sync()
            except Exception:
                logger.exception("Scheduled incremental sync failed")
