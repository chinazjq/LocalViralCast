from fastapi import APIRouter
from pydantic import BaseModel

from ..services.ffmpeg_service import FFmpegService

router = APIRouter(prefix="/api/media", tags=["media"])


class SimpleRenderRequest(BaseModel):
    image_path: str
    audio_path: str
    output_path: str | None = None


@router.post("/simple-render")
def simple_render(request: SimpleRenderRequest):
    try:
        service = FFmpegService()
        result = service.simple_render(
            image_path=request.image_path,
            audio_path=request.audio_path,
            output_path=request.output_path,
        )
        return {"success": True, "data": result, "error": ""}
    except Exception as exc:
        return {"success": False, "data": None, "error": str(exc)}
