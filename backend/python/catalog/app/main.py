from fastapi import FastAPI

app = FastAPI(title="catalog-api")


@app.get("/health")
def health():
    return {"service": "catalog-api", "status": "ok"}
