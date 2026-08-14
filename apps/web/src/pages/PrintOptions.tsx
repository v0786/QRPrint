import { useState } from "react";

export type PrintOptions = {
  colorMode: "BW" | "COLOR";
  copies: number;
  duplex: boolean;
  pageRange: string;
};

type Props = {
  pages: number;
  availableServices: string[];
  initial: PrintOptions;
  onNext: (options: PrintOptions) => void;
};

export function PrintOptionsPage({
  pages,
  availableServices,
  initial,
  onNext,
}: Props) {
  const [colorMode, setColorMode] = useState<"BW" | "COLOR">(initial.colorMode);
  const [copies, setCopies] = useState(initial.copies);
  const [duplex, setDuplex] = useState(initial.duplex);
  const [pageRange, setPageRange] = useState(initial.pageRange);

  const hasBW = availableServices.includes("BW");
  const hasColor = availableServices.includes("COLOR");
  const hasAnyMode = hasBW || hasColor;

  function handleSubmit() {
    onNext({ colorMode, copies, duplex, pageRange });
  }

  return (
    <div className="page">
      <h2>Print Options</h2>

      <div className="form-group">
        <span className="label">Print Mode</span>
        <div className="radio-group">
          {hasBW && (
            <label
              className={`radio-option ${colorMode === "BW" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="colorMode"
                value="BW"
                checked={colorMode === "BW"}
                onChange={() => setColorMode("BW")}
              />
              ⬜ Black &amp; White
            </label>
          )}
          {hasColor && (
            <label
              className={`radio-option ${colorMode === "COLOR" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="colorMode"
                value="COLOR"
                checked={colorMode === "COLOR"}
                onChange={() => setColorMode("COLOR")}
              />
              🌈 Color
            </label>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="copies" className="label">
          Copies
        </label>
        <div className="counter">
          <button
            type="button"
            className="counter-btn"
            onClick={() => setCopies((c) => Math.max(1, c - 1))}
            aria-label="Decrease copies"
          >
            −
          </button>
          <span className="counter-value">{copies}</span>
          <button
            type="button"
            className="counter-btn"
            onClick={() => setCopies((c) => Math.min(99, c + 1))}
            aria-label="Increase copies"
          >
            +
          </button>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="page-range" className="label">
          Page Range{" "}
          <span className="hint-inline">(e.g. 1-5, leave blank for all)</span>
        </label>
        <input
          id="page-range"
          type="text"
          className="text-input"
          placeholder={`All ${pages} pages`}
          value={pageRange}
          onChange={(e) => setPageRange(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="toggle-label">
          <span className="label">Double-sided</span>
          <input
            type="checkbox"
            checked={duplex}
            onChange={(e) => setDuplex(e.target.checked)}
          />
          <span className="toggle-slider" />
        </label>
      </div>

      <button
        type="button"
        className="btn-primary"
        disabled={!hasAnyMode}
        onClick={handleSubmit}
      >
        See Price
      </button>
    </div>
  );
}
