import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../../App";

test("Loads and displays title", () => {
    render(<App />);

    screen.getByRole("heading", { name: "Product price updater" });
});

test("Avoid fake positive", () => {
    render(<App />);

    const heading = screen.queryByRole("heading", { name: "Product price updaterx" });
    expect(heading).toBeNull();
});
