from decimal import Decimal

from pydantic import BaseModel, Field


class QuoteRequest(BaseModel):
    tenant_id: str | None = None
    store_id: str | None = None
    pages: int = Field(gt=0)
    copies: int = Field(gt=0)
    color_mode: str
    paper_size: str = "A4"
    duplex: bool = False


class QuoteResult(BaseModel):
    base_price: Decimal
    tax: Decimal
    discount: Decimal
    total_amount: Decimal
    currency: str = "INR"


def resolve_price_per_page(payload: QuoteRequest) -> Decimal:
    """Temporary lookup until pricing_rules persistence is wired in infrastructure."""
    if payload.color_mode.upper() == "COLOR":
        return Decimal("5.00")
    return Decimal("2.00")


def calculate_quote(payload: QuoteRequest, price_per_page: Decimal) -> QuoteResult:
    per_page = price_per_page
    base_price = per_page * Decimal(payload.pages) * Decimal(payload.copies)
    tax = (base_price * Decimal("0.18")).quantize(Decimal("0.01"))
    discount = Decimal("0.00")
    total_amount = base_price + tax - discount
    return QuoteResult(
        base_price=base_price,
        tax=tax,
        discount=discount,
        total_amount=total_amount,
    )
