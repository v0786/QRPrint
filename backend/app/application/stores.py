from pydantic import BaseModel


class StoreInfo(BaseModel):
    id: str
    tenant_id: str
    name: str
    status: str
    currency: str = "INR"
    available_services: list[str]
    payment_options: list[str]


# Temporary in-memory stub until DB persistence is wired.
# Returns a sensible default for any store_id so the customer flow works in development.
def get_store(store_id: str) -> StoreInfo | None:
    return StoreInfo(
        id=store_id,
        tenant_id="tenant-demo",
        name="Print Shop",
        status="ACTIVE",
        available_services=["BW", "COLOR"],
        payment_options=["CASH", "UPI"],
    )
