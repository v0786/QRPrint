from decimal import Decimal
from uuid import uuid4

from pydantic import BaseModel, Field

from app.application.pricing import QuoteRequest, calculate_quote, resolve_price_per_page
from app.domain.print_jobs.models import PrintJob
from app.domain.print_jobs.states import PrintJobState, is_valid_transition


class PrintJobCreateRequest(BaseModel):
    tenant_id: str
    store_id: str
    pages: int = Field(gt=0)
    copies: int = Field(gt=0)
    color_mode: str
    duplex: bool = False
    paper_size: str = "A4"


class PrintJobTransitionRequest(BaseModel):
    expected_version: int = Field(ge=1)
    target_state: PrintJobState


class ConcurrencyConflictError(Exception):
    pass


class InvalidTransitionError(Exception):
    pass


class PrintJobService:
    """Temporary in-memory service used until repository-backed persistence is wired."""

    def __init__(self) -> None:
        self._jobs: dict[str, PrintJob] = {}

    def create(self, payload: PrintJobCreateRequest) -> PrintJob:
        quote_request = QuoteRequest(
            tenant_id=payload.tenant_id,
            store_id=payload.store_id,
            pages=payload.pages,
            copies=payload.copies,
            color_mode=payload.color_mode,
            paper_size=payload.paper_size,
            duplex=payload.duplex,
        )
        quote = calculate_quote(quote_request, resolve_price_per_page(quote_request))
        job_id = str(uuid4())
        job = PrintJob(
            id=job_id,
            tenant_id=payload.tenant_id,
            store_id=payload.store_id,
            pages=payload.pages,
            copies=payload.copies,
            color_mode=payload.color_mode,
            duplex=payload.duplex,
            paper_size=payload.paper_size,
            base_price=Decimal(quote.base_price),
            tax=Decimal(quote.tax),
            discount=Decimal(quote.discount),
            total_amount=Decimal(quote.total_amount),
            state=PrintJobState.PAYMENT_PENDING,
            version=1,
        )
        self._jobs[job_id] = job
        return job

    def transition(self, job_id: str, payload: PrintJobTransitionRequest) -> PrintJob:
        job = self._jobs[job_id]
        if job.version != payload.expected_version:
            raise ConcurrencyConflictError(f"Version mismatch. current={job.version}")

        if not is_valid_transition(job.state, payload.target_state):
            raise InvalidTransitionError(f"{job.state} -> {payload.target_state} not allowed")

        job.state = payload.target_state
        job.version += 1
        return job


_service = PrintJobService()


def get_print_job_service() -> PrintJobService:
    return _service
