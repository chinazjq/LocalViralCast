import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, HTTPException

from ..config import get_settings
from ..services.ffmpeg_service import FFmpegService

router = APIRouter(prefix="/api/media", tags=["media"])


@router.post("/simple-render")
async def simple_render(
    image: UploadFile = File(...),
    audio: UploadFile = File(...),
):
    settings = get_settings()
    upload_dir = settings.data_dir / "uploads"
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Save uploaded files to temp location
    image_ext = Path(image.filename or "image.jpg").suffix
    audio_ext = Path(audio.filename or "audio.mp3").suffix

    image_path = upload_dir / f"{uuid4()}{image_ext}"
    audio_path = upload_dir / f"{uuid4()}{audio_ext}"

    try:
        with open(image_path, "wb") as f:
            shutil.copyfileobj(image.file, f)
        with open(audio_path, "wb") as f:
            shutil.copyfileobj(audio.file, f)

        service = FFmpegService()
        result = await service.async_simple_render(
            image_path=str(image_path),
            audio_path=str(audio_path),
        )
        return {"success": True, "data": result, "error": ""}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    finally:
        # Clean up uploaded temp files
        image_path.unlink(missing_ok=True)
        audio_path.unlink(missing_ok=True)
