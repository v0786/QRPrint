type Props = {
  onNext: () => void;
};

export function Splash({ onNext }: Props) {
  return (
    <div className="page splash">
      <div className="splash-logo">🖨️</div>
      <h1 className="splash-title">QRPrint</h1>
      <p className="splash-subtitle">Print anything, anywhere.</p>
      <button type="button" className="btn-primary" onClick={onNext}>
        Get Started
      </button>
    </div>
  );
}
