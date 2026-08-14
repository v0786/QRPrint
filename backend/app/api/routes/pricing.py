from fastapi import APIRouter

from app.application.pricing import QuoteRequest, QuoteResult, calculate_quote

router = APIRouter(tags=["pricing"])


@router.post("/pricing/quote", response_model=QuoteResult)
def quote(payload: QuoteRequest) -> QuoteResult:
    return calculate_quote(payload)
