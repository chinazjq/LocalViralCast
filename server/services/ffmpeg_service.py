import subprocess
from pathlib import Path
from uuid import uuid4

from ..config import get_settings


class FFmpegService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.settings.output_dir.mkdir(parents=True, exist_ok=True)

    def simple_render(
        self,
        image_path: str,
        audio_path: str,
        output_path: str | None = None,
    ) -> dict[str, str]:
        image = Path(image_path)
        audio = Path(audio_path)
        output = Path(output_path) if output_path else self.settings.output_dir / f"{uuid4()}.mp4"

        if not image.exists():
            raise FileNotFoundError(f"Image file not found: {image}")
        if not audio.exists():
            raise FileNotFoundError(f"Audio file not found: {audio}")

        output.parent.mkdir(parents=True, exist_ok=True)

        command = [
            "ffmpeg",
            "-y",
            "-loop",
            "1",
            "-i",
            str(image),
            "-i",
            str(audio),
            "-c:v",
            "libx264",
            "-tune",
            "stillimage",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-pix_fmt",
            "yuv420p",
            "-shortest",
            "-s",
            "1080x1920",
            str(output),
        ]

        result = subprocess.run(
            command,
            capture_output=True,
            check=False,
            text=True,
        )
        if result.returncode != 0:
            raise RuntimeError(result.stderr.strip() or "FFmpeg render failed")

        return {
            "output_path": str(output),
            "command": " ".join(command),
        }
