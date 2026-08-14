from fastapi import APIRouter, HTTPException, status

from app.application.print_jobs import (
    ConcurrencyConflictError,
    InvalidTransitionError,
    PrintJobCreateRequest,
    PrintJobTransitionRequest,
    service,
)

router = APIRouter(prefix="/print-jobs", tags=["print-jobs"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_print_job(payload: PrintJobCreateRequest) -> dict[str, object]:
    job = service.create(payload)
    return {
        "id": job.id,
        "total_amount": str(job.total_amount),
        "state": job.state,
        "version": job.version,
    }


@router.post("/{job_id}/transition")
def transition_print_job(job_id: str, payload: PrintJobTransitionRequest) -> dict[str, object]:
    try:
        job = service.transition(job_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found") from exc
    except ConcurrencyConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    except InvalidTransitionError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    return {"id": job.id, "state": job.state, "version": job.version}
