import { fireEvent, render, screen } from "@testing-library/react";

import { App } from "./App";

describe("App", () => {
  it("renders the splash screen on load", () => {
    render(<App />);
    expect(screen.getByText("QRPrint")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Get Started" }),
    ).toBeInTheDocument();
  });

  it("advances from splash to store step", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Get Started" }));
    // Store step shows a loading or error state (no real API in tests)
    expect(
      screen.getByText(/loading store|could not load/i),
    ).toBeInTheDocument();
  });
});
