from fastapi import FastAPI

app = FastAPI(title="order-api")


@app.get("/health")
def health():
    return {"service": "order-api", "status": "ok"}
