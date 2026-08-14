const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  PAYMENT_PENDING: "Waiting for payment confirmation",
  PAID: "Payment confirmed",
  QUEUED: "Queued for printing",
  PROCESSING: "Printing in progress…",
  STOPPED: "Printing paused",
  COMPLETED: "Print complete! Pick up your document.",
  FAILED: "Something went wrong. Please speak to the shopkeeper.",
  CANCELLED: "Order cancelled.",
  REFUND_PENDING: "Refund in progress",
  REFUNDED: "Refunded",
};

const TERMINAL_STATES = new Set([
  "COMPLETED",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
]);

type Props = {
  jobId: string | null;
  status: string;
  onDone: () => void;
};

export function JobStatus({ jobId, status, onDone }: Props) {
  const label = STATUS_LABELS[status] ?? status;
  const isTerminal = TERMINAL_STATES.has(status);

  return (
    <div className="page center">
      <h2>Order Status</h2>
      {jobId && (
        <p className="job-id">Job #{jobId.slice(0, 8).toUpperCase()}</p>
      )}

      <div className={`status-badge status-${status.toLowerCase()}`}>
        {label}
      </div>

      {!isTerminal && (
        <p className="hint">This page will update automatically.</p>
      )}

      {isTerminal && (
        <button type="button" className="btn-primary" onClick={onDone}>
          {status === "COMPLETED" ? "Done" : "Close"}
        </button>
      )}
    </div>
  );
}
