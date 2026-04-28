import asyncio
import subprocess
from pathlib import Path
from uuid import uuid4

from ..config import get_settings

# Allowed media file extensions
_ALLOWED_IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
_ALLOWED_AUDIO_EXT = {".mp3", ".wav", ".aac", ".ogg", ".flac", ".m4a"}


class FFmpegService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.settings.output_dir.mkdir(parents=True, exist_ok=True)

    def _validate_input_path(self, file_path: str, allowed_ext: set[str], label: str) -> Path:
        """Validate an input file path: resolve, ensure within data_dir, check extension."""
        p = Path(file_path).resolve()
        data_root = self.settings.data_dir.resolve()

        # Prevent path traversal: must be under data_dir
        try:
            p.relative_to(data_root)
        except ValueError:
            raise ValueError(f"{label} path must be within data directory")

        if p.suffix.lower() not in allowed_ext:
            raise ValueError(f"{label} file type not allowed: {p.suffix}")

        if not p.exists():
            raise FileNotFoundError(f"{label} file not found: {p}")

        return p

    def simple_render(
        self,
        image_path: str,
        audio_path: str,
        output_path: str | None = None,
    ) -> dict[str, str]:
        image = self._validate_input_path(image_path, _ALLOWED_IMAGE_EXT, "Image")
        audio = self._validate_input_path(audio_path, _ALLOWED_AUDIO_EXT, "Audio")

        if output_path:
            output = Path(output_path).resolve()
            output_root = self.settings.output_dir.resolve()
            try:
                output.relative_to(output_root)
            except ValueError:
                raise ValueError("Output path must be within output directory")
            if output.suffix.lower() != ".mp4":
                raise ValueError("Output must be .mp4")
        else:
            output = self.settings.output_dir / f"{uuid4()}.mp4"

        output.parent.mkdir(parents=True, exist_ok=True)

        command = [
            "ffmpeg",
            "-y",
            "-loop", "1",
            "-i", str(image),
            "-i", str(audio),
            "-c:v", "libx264",
            "-tune", "stillimage",
            "-c:a", "aac",
            "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-shortest",
            "-s", "1080x1920",
            str(output),
        ]

        result = subprocess.run(
            command,
            capture_output=True,
            check=False,
            text=True,
        )
        if result.returncode != 0:
            # Don't expose full command / stderr details
            raise RuntimeError("FFmpeg render failed. Check input files and try again.")

        return {
            "output_path": str(output),
        }

    async def async_simple_render(
        self,
        image_path: str,
        audio_path: str,
        output_path: str | None = None,
    ) -> dict[str, str]:
        """Async version that doesn't block the event loop."""
        image = self._validate_input_path(image_path, _ALLOWED_IMAGE_EXT, "Image")
        audio = self._validate_input_path(audio_path, _ALLOWED_AUDIO_EXT, "Audio")

        if output_path:
            output = Path(output_path).resolve()
            output_root = self.settings.output_dir.resolve()
            try:
                output.relative_to(output_root)
            except ValueError:
                raise ValueError("Output path must be within output directory")
            if output.suffix.lower() != ".mp4":
                raise ValueError("Output must be .mp4")
        else:
            output = self.settings.output_dir / f"{uuid4()}.mp4"

        output.parent.mkdir(parents=True, exist_ok=True)

        command = [
            "ffmpeg",
            "-y",
            "-loop", "1",
            "-i", str(image),
            "-i", str(audio),
            "-c:v", "libx264",
            "-tune", "stillimage",
            "-c:a", "aac",
            "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-shortest",
            "-s", "1080x1920",
            str(output),
        ]

        proc = await asyncio.create_subprocess_exec(
            *command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await proc.communicate()

        if proc.returncode != 0:
            raise RuntimeError("FFmpeg render failed. Check input files and try again.")

        return {
            "output_path": str(output),
        }
