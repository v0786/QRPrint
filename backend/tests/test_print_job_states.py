from app.domain.print_jobs.states import PrintJobState, is_valid_transition


def test_allows_expected_transition() -> None:
    assert is_valid_transition(PrintJobState.PAYMENT_PENDING, PrintJobState.PAID)


def test_rejects_invalid_transition() -> None:
    assert not is_valid_transition(PrintJobState.DRAFT, PrintJobState.COMPLETED)
