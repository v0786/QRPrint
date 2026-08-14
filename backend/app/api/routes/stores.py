from fastapi import APIRouter, HTTPException, status

from app.application.stores import StoreInfo, get_store

router = APIRouter(prefix="/stores", tags=["stores"])


@router.get("/{store_id}", response_model=StoreInfo)
def read_store(store_id: str) -> StoreInfo:
    store = get_store(store_id)
    if store is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found")
    return store
