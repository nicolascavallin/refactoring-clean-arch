import { expect, test } from "vitest";
import { render, RenderResult, screen } from "@testing-library/react";
import { ProductsPage } from "../ProductsPage";
import { ReactNode } from "react";
import { AppProvider } from "../../context/AppProvider";

function myCustomRender(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}

test("Loads and displays title", () => {
    myCustomRender(<ProductsPage />);

    screen.getByRole("heading", { name: "Product price updater" });
});

test("Avoid fake positive", () => {
    myCustomRender(<ProductsPage />);

    const heading = screen.queryByRole("heading", { name: "Product price updaterx" });
    expect(heading).toBeNull();
});
