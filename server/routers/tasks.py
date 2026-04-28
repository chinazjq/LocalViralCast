from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.task import Task

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


class TaskCreateRequest(BaseModel):
    project_id: str | None = None
    type: str
    status: str = "pending"
    input_data: dict[str, Any] | None = None
    output_data: dict[str, Any] | None = None


def serialize_task(task: Task) -> dict[str, Any]:
    return {
        "id": task.id,
        "project_id": task.project_id,
        "type": task.type,
        "status": task.status,
        "input_data": task.input_data,
        "output_data": task.output_data,
        "created_at": task.created_at.isoformat() if task.created_at else None,
        "updated_at": task.updated_at.isoformat() if task.updated_at else None,
    }


@router.get("")
def list_tasks(
    db: Session = Depends(get_db),
    limit: int = 50,
    offset: int = 0,
):
    tasks = db.scalars(
        select(Task).order_by(Task.created_at.desc()).offset(offset).limit(limit)
    ).all()
    return {"success": True, "data": [serialize_task(t) for t in tasks], "error": ""}


@router.post("")
def create_task(request: TaskCreateRequest, db: Session = Depends(get_db)):
    try:
        task = Task(
            project_id=request.project_id,
            type=request.type,
            status=request.status,
            input_data=request.input_data,
            output_data=request.output_data,
        )
        db.add(task)
        db.commit()
        db.refresh(task)
        return {"success": True, "data": serialize_task(task), "error": ""}
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc))
