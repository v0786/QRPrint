import { useMemo, useState } from "react";

import { ApiClient } from "./api/client";

const steps = [
  "Splash",
  "Welcome",
  "Store",
  "Upload",
  "Print Configuration",
  "Price",
  "Confirmation",
  "Payment",
  "Job Status",
  "Thank You",
  "Feedback",
];

export function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const client = useMemo(
    () => new ApiClient(import.meta.env.VITE_API_BASE_URL ?? ""),
    [],
  );

  return (
    <main>
      <h1>QRPrint MVP Foundation</h1>
      <p>Current step: {steps[stepIndex]}</p>
      <button
        type="button"
        onClick={() => setStepIndex((v) => Math.min(v + 1, steps.length - 1))}
      >
        Next
      </button>
      <p>API target: {client.baseUrl || "not configured"}</p>
    </main>
  );
}
