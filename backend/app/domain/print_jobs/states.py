from enum import StrEnum


class PrintJobState(StrEnum):
    DRAFT = "DRAFT"
    CONFIGURED = "CONFIGURED"
    WAITING_UPLOAD = "WAITING_UPLOAD"
    UPLOADING = "UPLOADING"
    UPLOADED = "UPLOADED"
    PAYMENT_PENDING = "PAYMENT_PENDING"
    PAID = "PAID"
    QUEUED = "QUEUED"
    PROCESSING = "PROCESSING"
    STOPPED = "STOPPED"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    REFUND_PENDING = "REFUND_PENDING"
    REFUNDED = "REFUNDED"


ALLOWED_TRANSITIONS: dict[PrintJobState, set[PrintJobState]] = {
    PrintJobState.DRAFT: {PrintJobState.CONFIGURED, PrintJobState.CANCELLED},
    PrintJobState.CONFIGURED: {PrintJobState.WAITING_UPLOAD, PrintJobState.CANCELLED},
    PrintJobState.WAITING_UPLOAD: {PrintJobState.UPLOADING, PrintJobState.CANCELLED},
    PrintJobState.UPLOADING: {
        PrintJobState.UPLOADED,
        PrintJobState.FAILED,
        PrintJobState.CANCELLED,
    },
    PrintJobState.UPLOADED: {PrintJobState.PAYMENT_PENDING, PrintJobState.CANCELLED},
    PrintJobState.PAYMENT_PENDING: {
        PrintJobState.PAID,
        PrintJobState.CANCELLED,
        PrintJobState.FAILED,
    },
    PrintJobState.PAID: {PrintJobState.QUEUED, PrintJobState.REFUND_PENDING},
    PrintJobState.QUEUED: {PrintJobState.PROCESSING, PrintJobState.STOPPED, PrintJobState.FAILED},
    PrintJobState.PROCESSING: {
        PrintJobState.COMPLETED,
        PrintJobState.STOPPED,
        PrintJobState.FAILED,
    },
    PrintJobState.STOPPED: {PrintJobState.QUEUED, PrintJobState.CANCELLED, PrintJobState.FAILED},
    PrintJobState.COMPLETED: {PrintJobState.REFUND_PENDING},
    PrintJobState.FAILED: {PrintJobState.REFUND_PENDING},
    PrintJobState.CANCELLED: set(),
    PrintJobState.REFUND_PENDING: {PrintJobState.REFUNDED},
    PrintJobState.REFUNDED: set(),
}


def is_valid_transition(current: PrintJobState, target: PrintJobState) -> bool:
    return target in ALLOWED_TRANSITIONS[current]
