import type { QuoteResult } from "../domains/pricing";
import type { PrintOptions } from "./PrintOptions";

type Props = {
  fileName: string;
  pages: number;
  options: PrintOptions;
  quote: QuoteResult | null;
  loading: boolean;
  error: string | null;
  onConfirm: () => void;
  onBack: () => void;
};

export function PriceConfirmation({
  fileName,
  pages,
  options,
  quote,
  loading,
  error,
  onConfirm,
  onBack,
}: Props) {
  return (
    <div className="page">
      <h2>Price &amp; Confirmation</h2>

      <div className="summary-card">
        <div className="summary-row">
          <span>File</span>
          <span className="summary-val">{fileName}</span>
        </div>
        <div className="summary-row">
          <span>Pages</span>
          <span className="summary-val">{pages}</span>
        </div>
        <div className="summary-row">
          <span>Mode</span>
          <span className="summary-val">
            {options.colorMode === "BW" ? "B&W" : "Color"}
          </span>
        </div>
        <div className="summary-row">
          <span>Copies</span>
          <span className="summary-val">{options.copies}</span>
        </div>
        {options.pageRange && (
          <div className="summary-row">
            <span>Page Range</span>
            <span className="summary-val">{options.pageRange}</span>
          </div>
        )}
        <div className="summary-row">
          <span>Double-sided</span>
          <span className="summary-val">{options.duplex ? "Yes" : "No"}</span>
        </div>
      </div>

      {loading && <p className="hint">Calculating price…</p>}
      {error && <p className="error">Could not fetch price: {error}</p>}

      {quote && (
        <div className="price-card">
          <div className="price-row">
            <span>Base</span>
            <span>₹{quote.base_price}</span>
          </div>
          <div className="price-row">
            <span>Tax</span>
            <span>₹{quote.tax}</span>
          </div>
          {parseFloat(quote.discount) > 0 && (
            <div className="price-row discount">
              <span>Discount</span>
              <span>−₹{quote.discount}</span>
            </div>
          )}
          <div className="price-row total">
            <span>Total</span>
            <span>₹{quote.total_amount}</span>
          </div>
        </div>
      )}

      <div className="btn-row">
        <button type="button" className="btn-secondary" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="btn-primary"
          disabled={!quote || loading}
          onClick={onConfirm}
        >
          Confirm &amp; Pay
        </button>
      </div>
    </div>
  );
}
