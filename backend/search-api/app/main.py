from fastapi import FastAPI

app = FastAPI(title="search-api")


@app.get("/health")
def health():
    return {"service": "search-api", "status": "ok"}
