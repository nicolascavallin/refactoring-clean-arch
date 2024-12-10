import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { render, RenderResult, screen } from "@testing-library/react";
import { ProductsPage } from "../../ProductsPage";
import { ReactNode } from "react";
import { AppProvider } from "../../../context/AppProvider";
import { MockWebServer } from "../../../test/MockWebServer";
import { givenEmptyProducts, givenProducts } from "./ProductsPage.fixture";
import { verifyHeader } from "./ProductsPage.helpers";

const mockWebServer = new MockWebServer();

function myCustomRender(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}

describe("ProductsPage", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    test("Loads and displays title", () => {
        givenProducts(mockWebServer);

        myCustomRender(<ProductsPage />);

        screen.getByRole("heading", { name: "Product price updater" });
    });

    test("Avoid fake positive", () => {
        givenProducts(mockWebServer);

        myCustomRender(<ProductsPage />);

        const heading = screen.queryByRole("heading", { name: "Product price updaterx" });
        expect(heading).toBeNull();
    });

    test("Should show an empty table when no data", async () => {
        givenEmptyProducts(mockWebServer);

        myCustomRender(<ProductsPage />);

        const rows = await screen.findAllByRole("row");

        expect(rows).toHaveLength(1);

        verifyHeader(rows[0]);
    });
});
