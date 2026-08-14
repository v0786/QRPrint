from app.application.stores import get_store


def test_get_store_returns_store_for_any_id() -> None:
    store = get_store("any-id")
    assert store is not None
    assert store.id == "any-id"
    assert store.status == "ACTIVE"
    assert "BW" in store.available_services
    assert "COLOR" in store.available_services
