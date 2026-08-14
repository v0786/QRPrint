import { jsx as _jsx } from "react/jsx-runtime";
import { fireEvent, render, screen } from "@testing-library/react";
import { App } from "./App";
describe("App", () => {
    it("advances through customer flow steps", () => {
        render(_jsx(App, {}));
        expect(screen.getByText("Current step: Splash")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Next" }));
        expect(screen.getByText("Current step: Welcome")).toBeInTheDocument();
    });
});
