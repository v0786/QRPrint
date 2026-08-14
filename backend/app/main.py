from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.api.routes.pricing import router as pricing_router
from app.api.routes.print_jobs import router as print_jobs_router


def create_app() -> FastAPI:
    app = FastAPI(title="QRPrint API", version="0.1.0")
    app.include_router(health_router)
    app.include_router(pricing_router, prefix="/api/v1")
    app.include_router(print_jobs_router, prefix="/api/v1")
    return app


app = create_app()
