from fastapi import APIRouter

from app.application.pricing import (
    QuoteRequest,
    QuoteResult,
    calculate_quote,
    resolve_price_per_page,
)

router = APIRouter(tags=["pricing"])


@router.post("/pricing/quote", response_model=QuoteResult)
def quote(payload: QuoteRequest) -> QuoteResult:
    return calculate_quote(payload, resolve_price_per_page(payload))
