import type { StoreInfo } from "../domains/stores";

type Props = {
  store: StoreInfo | null;
  loading: boolean;
  error: string | null;
  onNext: () => void;
};

export function StoreWelcome({ store, loading, error, onNext }: Props) {
  if (loading) {
    return (
      <div className="page center">
        <p>Loading store…</p>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="page center">
        <p className="error">
          Could not load store. Please scan the QR code again.
        </p>
        {error && <p className="error-detail">{error}</p>}
      </div>
    );
  }

  if (store.status !== "ACTIVE") {
    return (
      <div className="page center">
        <p className="error">This store is currently not accepting orders.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="store-header">
        <span className="store-icon">🏪</span>
        <h2 className="store-name">{store.name}</h2>
        <span className="store-badge">Open</span>
      </div>
      <p className="store-desc">Ready to print your documents.</p>
      <ul className="store-services">
        {store.available_services.map((s) => (
          <li key={s}>{s === "BW" ? "Black & White" : "Color"} printing</li>
        ))}
      </ul>
      <button type="button" className="btn-primary" onClick={onNext}>
        Start Printing
      </button>
    </div>
  );
}
