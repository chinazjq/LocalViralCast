from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health")
def health_check():
    return {
        "success": True,
        "data": {"status": "ok"},
        "error": "",
    }
