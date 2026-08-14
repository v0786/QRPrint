import pytest

from app.application.print_jobs import (
    ConcurrencyConflictError,
    InvalidTransitionError,
    PrintJobCreateRequest,
    PrintJobService,
    PrintJobTransitionRequest,
)
from app.domain.print_jobs.states import PrintJobState


def test_create_is_server_authoritative_price() -> None:
    service = PrintJobService()
    job = service.create(
        PrintJobCreateRequest(
            tenant_id="t1",
            store_id="s1",
            pages=5,
            copies=2,
            color_mode="BW",
        )
    )

    assert job.state == PrintJobState.PAYMENT_PENDING
    assert str(job.total_amount) == "23.60"


def test_transition_checks_version_and_state() -> None:
    service = PrintJobService()
    job = service.create(
        PrintJobCreateRequest(
            tenant_id="t1",
            store_id="s1",
            pages=1,
            copies=1,
            color_mode="BW",
        )
    )

    with pytest.raises(InvalidTransitionError):
        service.transition(
            job.id,
            PrintJobTransitionRequest(
                expected_version=1,
                target_state=PrintJobState.COMPLETED,
            ),
        )

    with pytest.raises(ConcurrencyConflictError):
        service.transition(
            job.id,
            PrintJobTransitionRequest(
                expected_version=2,
                target_state=PrintJobState.PAID,
            ),
        )
