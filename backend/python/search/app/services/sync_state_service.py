from __future__ import annotations

import json
from pathlib import Path
from threading import Lock
from typing import Any

from app.core.config import settings


class SyncStateService:
    def __init__(self) -> None:
        self.path = Path(settings.sync_state_file)
        self.lock = Lock()
        self.path.parent.mkdir(parents=True, exist_ok=True)
        if not self.path.exists():
            self.save(
                {
                    "last_successful_sync_at": None,
                    "last_full_sync_at": None,
                    "last_mode": None,
                    "is_sync_running": False,
                }
            )

    def load(self) -> dict[str, Any]:
        with self.lock:
            with self.path.open("r", encoding="utf-8") as file:
                return json.load(file)

    def save(self, state: dict[str, Any]) -> None:
        with self.lock:
            with self.path.open("w", encoding="utf-8") as file:
                json.dump(state, file, ensure_ascii=False, indent=2)

    def patch(self, **kwargs: Any) -> dict[str, Any]:
        state = self.load()
        state.update(kwargs)
        self.save(state)
        return state
