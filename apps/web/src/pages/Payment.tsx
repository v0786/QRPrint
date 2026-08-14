import { useState } from "react";

type PaymentMethod = "CASH" | "UPI";

type Props = {
  totalAmount: string;
  currency: string;
  paymentOptions: string[];
  onPay: (method: PaymentMethod) => void;
  loading: boolean;
  error: string | null;
};

export function Payment({
  totalAmount,
  currency,
  paymentOptions,
  onPay,
  loading,
  error,
}: Props) {
  const [method, setMethod] = useState<PaymentMethod>(
    paymentOptions.includes("CASH") ? "CASH" : "UPI",
  );

  const symbol = currency === "INR" ? "₹" : currency;

  return (
    <div className="page">
      <h2>Payment</h2>
      <p className="total-due">
        Amount due:{" "}
        <strong>
          {symbol}
          {totalAmount}
        </strong>
      </p>

      <div className="form-group">
        <span className="label">Payment Method</span>
        <div className="radio-group">
          {paymentOptions.includes("CASH") && (
            <label
              className={`radio-option ${method === "CASH" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="method"
                value="CASH"
                checked={method === "CASH"}
                onChange={() => setMethod("CASH")}
              />
              💵 Cash (Pay at counter)
            </label>
          )}
          {paymentOptions.includes("UPI") && (
            <label
              className={`radio-option ${method === "UPI" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="method"
                value="UPI"
                checked={method === "UPI"}
                onChange={() => setMethod("UPI")}
              />
              📱 UPI / Razorpay
            </label>
          )}
        </div>
      </div>

      {method === "CASH" && (
        <div className="info-box">
          <p>
            Show this screen to the shopkeeper and pay {symbol}
            {totalAmount} in cash.
          </p>
        </div>
      )}

      {method === "UPI" && (
        <div className="info-box">
          <p>
            Online payment integration coming soon. Please choose Cash for now.
          </p>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <button
        type="button"
        className="btn-primary"
        disabled={loading || method === "UPI"}
        onClick={() => onPay(method)}
      >
        {loading
          ? "Processing…"
          : method === "CASH"
            ? "Confirm Cash Payment"
            : "Pay Now"}
      </button>
    </div>
  );
}
