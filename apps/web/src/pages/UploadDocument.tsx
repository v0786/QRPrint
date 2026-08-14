import { useRef, useState } from "react";

const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB

type Props = {
  onNext: (file: File, pageCount: number) => void;
};

export function UploadDocument({ onNext }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    setError(null);
    setFile(null);

    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }

    if (selected.size > MAX_FILE_BYTES) {
      setError("File is too large. Maximum size is 20 MB.");
      return;
    }

    setFile(selected);
  }

  function handleSubmit() {
    if (!file) return;
    onNext(file, pageCount);
  }

  return (
    <div className="page">
      <h2>Upload Document</h2>
      <p className="hint">Select a PDF file to print.</p>

      <div
        className="drop-zone"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Select PDF file"
      >
        {file ? (
          <span className="file-name">📄 {file.name}</span>
        ) : (
          <span>Tap to select a PDF file</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden-input"
        onChange={handleFileChange}
      />

      {error && <p className="error">{error}</p>}

      {file && (
        <div className="form-group">
          <label htmlFor="page-count">
            Number of pages in document
            <input
              id="page-count"
              type="number"
              min={1}
              max={500}
              value={pageCount}
              onChange={(e) =>
                setPageCount(Math.max(1, Number(e.target.value)))
              }
            />
          </label>
        </div>
      )}

      <button
        type="button"
        className="btn-primary"
        disabled={!file}
        onClick={handleSubmit}
      >
        Next
      </button>
    </div>
  );
}
