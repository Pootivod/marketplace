from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "search-api"
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    opensearch_host: str = "localhost"
    opensearch_port: int = 9200
    opensearch_scheme: str = "http"
    opensearch_username: str | None = None
    opensearch_password: str | None = None
    opensearch_verify_certs: bool = False
    opensearch_index: str = "goods_search_v1"

    goods_api_base_url: str = "http://localhost:8080"
    goods_api_timeout_seconds: int = 15
    goods_sync_batch_size: int = 500
    goods_sync_endpoint: str = "/api/v1/goods/sync"
    goods_all_endpoint: str = "/api/v1/goods/all"
    goods_single_endpoint: str = "/api/v1/goods/{id}"

    sync_interval_seconds: int = 600
    run_full_sync_on_startup: bool = True
    force_full_sync_on_startup: bool = False

    sync_state_file: str = "./data/sync_state.json"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
