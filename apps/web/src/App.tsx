import { useCallback, useEffect, useMemo, useState } from "react";

import "./App.css";
import { ApiClient } from "./api/client";
import type { QuoteResult } from "./domains/pricing";
import { fetchQuote } from "./domains/pricing";
import { createPrintJob } from "./domains/print-jobs";
import type { StoreInfo } from "./domains/stores";
import { fetchStore } from "./domains/stores";
import { JobStatus } from "./pages/JobStatus";
import { Payment } from "./pages/Payment";
import { PriceConfirmation } from "./pages/PriceConfirmation";
import { PrintOptionsPage } from "./pages/PrintOptions";
import type { PrintOptions } from "./pages/PrintOptions";
import { Splash } from "./pages/Splash";
import { StoreWelcome } from "./pages/StoreWelcome";
import { ThankYou } from "./pages/ThankYou";
import { UploadDocument } from "./pages/UploadDocument";

type Step =
  | "splash"
  | "store"
  | "upload"
  | "options"
  | "price"
  | "payment"
  | "status"
  | "thankyou";

const STEPS: Step[] = [
  "splash",
  "store",
  "upload",
  "options",
  "price",
  "payment",
  "status",
  "thankyou",
];

function extractStoreId(): string {
  const match = /^\/store\/([^/?#]+)/.exec(window.location.pathname);
  return match?.[1] ?? "demo";
}

function progressPercent(step: Step): number {
  const idx = STEPS.indexOf(step);
  return Math.round(((idx + 1) / STEPS.length) * 100);
}

export function App() {
  const client = useMemo(
    () => new ApiClient(import.meta.env.VITE_API_BASE_URL ?? ""),
    [],
  );

  const [step, setStep] = useState<Step>("splash");
  const [storeId] = useState<string>(extractStoreId);

  // Store
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [storeLoading, setStoreLoading] = useState(false);
  const [storeError, setStoreError] = useState<string | null>(null);

  // Document
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(1);

  // Print options
  const [options, setOptions] = useState<PrintOptions>({
    colorMode: "BW",
    copies: 1,
    duplex: false,
    pageRange: "",
  });

  // Pricing
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  // Job
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState("PAYMENT_PENDING");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Load store when entering store step
  useEffect(() => {
    if (step !== "store") return;
    if (store) return;

    setStoreLoading(true);
    setStoreError(null);

    fetchStore(client, storeId)
      .then((s) => {
        setStore(s);
      })
      .catch((err: unknown) => {
        setStoreError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => setStoreLoading(false));
  }, [step, client, storeId, store]);

  // Fetch quote when entering price step
  useEffect(() => {
    if (step !== "price") return;

    setQuoteLoading(true);
    setQuoteError(null);
    setQuote(null);

    fetchQuote(client, {
      tenant_id: store?.tenant_id,
      store_id: storeId,
      pages: pageCount,
      copies: options.copies,
      color_mode: options.colorMode,
      duplex: options.duplex,
    })
      .then((q) => setQuote(q))
      .catch((err: unknown) => {
        setQuoteError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => setQuoteLoading(false));
  }, [step, client, store, storeId, pageCount, options]);

  const handleSplashNext = useCallback(() => setStep("store"), []);

  const handleStoreNext = useCallback(() => setStep("upload"), []);

  const handleUploadNext = useCallback((f: File, pages: number) => {
    setFile(f);
    setPageCount(pages);
    setStep("options");
  }, []);

  const handleOptionsNext = useCallback((opts: PrintOptions) => {
    setOptions(opts);
    setStep("price");
  }, []);

  const handlePriceConfirm = useCallback(() => {
    setStep("payment");
  }, []);

  const handlePay = useCallback(
    async (method: "CASH" | "UPI") => {
      if (!store || !quote) return;
      // UPI integration is handled in Phase 4; only CASH is enabled for MVP.
      if (method !== "CASH") return;

      setPaymentLoading(true);
      setPaymentError(null);

      try {
        const job = await createPrintJob(client, {
          tenant_id: store.tenant_id,
          store_id: storeId,
          pages: pageCount,
          copies: options.copies,
          color_mode: options.colorMode,
          duplex: options.duplex,
          paper_size: "A4",
        });
        setJobId(job.id);
        setJobStatus(job.state);
        setStep("status");
      } catch (err: unknown) {
        setPaymentError(err instanceof Error ? err.message : "Payment failed");
      } finally {
        setPaymentLoading(false);
      }
    },
    [client, store, storeId, pageCount, options, quote],
  );

  const handleJobDone = useCallback(() => setStep("thankyou"), []);

  const handleStartOver = useCallback(() => {
    setStep("splash");
    setFile(null);
    setPageCount(1);
    setOptions({ colorMode: "BW", copies: 1, duplex: false, pageRange: "" });
    setQuote(null);
    setJobId(null);
    setJobStatus("PAYMENT_PENDING");
    setPaymentError(null);
  }, []);

  const showProgress = step !== "splash" && step !== "thankyou";

  return (
    <>
      {showProgress && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent(step)}%` }}
          />
        </div>
      )}

      {step === "splash" && <Splash onNext={handleSplashNext} />}

      {step === "store" && (
        <StoreWelcome
          store={store}
          loading={storeLoading}
          error={storeError}
          onNext={handleStoreNext}
        />
      )}

      {step === "upload" && <UploadDocument onNext={handleUploadNext} />}

      {step === "options" && (
        <PrintOptionsPage
          pages={pageCount}
          availableServices={store?.available_services ?? ["BW", "COLOR"]}
          initial={options}
          onNext={handleOptionsNext}
        />
      )}

      {step === "price" && (
        <PriceConfirmation
          fileName={file?.name ?? ""}
          pages={pageCount}
          options={options}
          quote={quote}
          loading={quoteLoading}
          error={quoteError}
          onConfirm={handlePriceConfirm}
          onBack={() => setStep("options")}
        />
      )}

      {step === "payment" &&
        (quote && store ? (
          <Payment
            totalAmount={quote.total_amount}
            currency={quote.currency}
            paymentOptions={store.payment_options}
            onPay={(method) => void handlePay(method)}
            loading={paymentLoading}
            error={paymentError}
          />
        ) : (
          <div className="page center">
            <p className="error">Session expired. Please start over.</p>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleStartOver}
            >
              Start Over
            </button>
          </div>
        ))}

      {step === "status" && (
        <JobStatus jobId={jobId} status={jobStatus} onDone={handleJobDone} />
      )}

      {step === "thankyou" && <ThankYou onStartOver={handleStartOver} />}
    </>
  );
}
