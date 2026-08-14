from dataclasses import dataclass
from decimal import Decimal

from app.domain.print_jobs.states import PrintJobState


@dataclass(slots=True)
class PrintJob:
    id: str
    tenant_id: str
    store_id: str
    pages: int
    copies: int
    color_mode: str
    duplex: bool
    paper_size: str
    base_price: Decimal
    tax: Decimal
    discount: Decimal
    total_amount: Decimal
    state: PrintJobState
    version: int
