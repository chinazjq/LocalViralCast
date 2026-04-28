from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..providers.ollama import OllamaProvider

router = APIRouter(prefix="/api/llm", tags=["llm"])


class GenerateRequest(BaseModel):
    prompt: str
    model: str | None = None
    options: dict[str, Any] | None = None


@router.post("/generate")
async def generate(request: GenerateRequest):
    try:
        provider = OllamaProvider()
        result = await provider.generate(
            prompt=request.prompt,
            model=request.model,
            options=request.options,
        )
        return {"success": True, "data": result, "error": ""}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Ollama generate failed: {exc}")


@router.post("/test")
async def test_ollama():
    try:
        provider = OllamaProvider()
        result = await provider.test()
        return {"success": True, "data": {"message": "Ollama connected", "models": result}, "error": ""}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Ollama connection failed: {exc}")
