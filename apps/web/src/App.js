import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const client = useMemo(() => new ApiClient(import.meta.env.VITE_API_BASE_URL ?? ""), []);
    return (_jsxs("main", { children: [_jsx("h1", { children: "QRPrint MVP Foundation" }), _jsxs("p", { children: ["Current step: ", steps[stepIndex]] }), _jsx("button", { type: "button", onClick: () => setStepIndex((v) => Math.min(v + 1, steps.length - 1)), children: "Next" }), _jsxs("p", { children: ["API target: ", client.baseUrl || "not configured"] })] }));
}
