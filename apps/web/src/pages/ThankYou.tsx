import { useState } from "react";

type Props = {
  onStartOver: () => void;
};

export function ThankYou({ onStartOver }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="page center">
        <div className="big-icon">🎉</div>
        <h2>Thank you for your feedback!</h2>
        <button type="button" className="btn-secondary" onClick={onStartOver}>
          Print Another
        </button>
      </div>
    );
  }

  return (
    <div className="page center">
      <div className="big-icon">✅</div>
      <h2>Print Complete!</h2>
      <p>How was your experience?</p>

      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${rating !== null && star <= rating ? "filled" : ""}`}
            onClick={() => setRating(star)}
            aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>

      <div className="btn-row">
        <button type="button" className="btn-secondary" onClick={onStartOver}>
          Skip
        </button>
        <button
          type="button"
          className="btn-primary"
          disabled={rating === null}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
