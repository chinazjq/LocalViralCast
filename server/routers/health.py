from fastapi import APIRouter, HTTPException

from ..providers.ollama import OllamaProvider

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health")
async def health_check():
    ollama_connected = False
    try:
        provider = OllamaProvider()
        await provider.test()
        ollama_connected = True
    except Exception:
        pass

    return {
        "success": True,
        "data": {
            "status": "ok",
            "version": "0.1.0",
            "ollama_connected": ollama_connected,
        },
        "error": "",
    }
