from decimal import Decimal

from pydantic import BaseModel, Field


class QuoteRequest(BaseModel):
    pages: int = Field(gt=0)
    copies: int = Field(gt=0)
    color_mode: str


class QuoteResult(BaseModel):
    base_price: Decimal
    tax: Decimal
    discount: Decimal
    total_amount: Decimal
    currency: str = "INR"


def calculate_quote(payload: QuoteRequest) -> QuoteResult:
    per_page = Decimal("5.00") if payload.color_mode.upper() == "COLOR" else Decimal("2.00")
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
