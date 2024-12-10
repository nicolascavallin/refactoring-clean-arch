import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { render, RenderResult, screen } from "@testing-library/react";
import { ProductsPage } from "../ProductsPage";
import { ReactNode } from "react";
import { AppProvider } from "../../context/AppProvider";
import { MockWebServer } from "../../test/MockWebServer";
import ResponseJSON from "./data/response.json";

const mockWebServer = new MockWebServer();

function myCustomRender(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}

function givenProducts() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "https://fakestoreapi.com/products",
            httpStatusCode: 200,
            response: ResponseJSON,
        },
    ]);
}

describe("ProductsPage", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    test("Loads and displays title", () => {
        givenProducts();

        myCustomRender(<ProductsPage />);

        screen.getByRole("heading", { name: "Product price updater" });
    });

    test("Avoid fake positive", () => {
        givenProducts();

        myCustomRender(<ProductsPage />);

        const heading = screen.queryByRole("heading", { name: "Product price updaterx" });
        expect(heading).toBeNull();
    });
});
