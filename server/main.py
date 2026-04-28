from fastapi import FastAPI

from .config import get_settings
from .database import init_db
from .routers import health, llm, media, tasks

settings = get_settings()

app = FastAPI(title=settings.app_name)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


app.include_router(health.router)
app.include_router(llm.router)
app.include_router(media.router)
app.include_router(tasks.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server.main:app", host=settings.host, port=settings.port, reload=True)
