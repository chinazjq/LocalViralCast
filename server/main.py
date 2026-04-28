from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import get_settings
from .database import init_db
from .routers import health, llm, media, tasks

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    yield
    # Shutdown (if needed)


app = FastAPI(title=settings.app_name, lifespan=lifespan)

# ─── CORS ────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:1420", "http://127.0.0.1:1420", "tauri://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Global exception handler ────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch unhandled exceptions and return proper HTTP error responses."""
    # Don't expose internal error details to client
    return JSONResponse(
        status_code=500,
        content={"success": False, "data": None, "error": "Internal server error"},
    )


# ─── Routers ─────────────────────────────────────────────────────────────
app.include_router(health.router)
app.include_router(llm.router)
app.include_router(media.router)
app.include_router(tasks.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server.main:app", host=settings.host, port=settings.port, reload=True)
