import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { render, RenderResult, screen } from "@testing-library/react";
import { ProductsPage } from "../../ProductsPage";
import { ReactNode } from "react";
import { AppProvider } from "../../../context/AppProvider";
import { MockWebServer } from "../../../test/MockWebServer";
import { givenEmptyProducts, givenProducts } from "./ProductsPage.fixture";
import {
    openDialogToEditPrice,
    savePrice,
    typePrice,
    verifyDialog,
    verifyError,
    verifyHeader,
    verifyPriceAndStatusInRow,
    verifyRows,
    waitUntilTableIsLoaded,
} from "./ProductsPage.helpers";

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

    describe("Table", () => {
        test("Should show an empty table when no data", async () => {
            givenEmptyProducts(mockWebServer);

            myCustomRender(<ProductsPage />);

            const rows = await screen.findAllByRole("row");

            expect(rows).toHaveLength(1);

            verifyHeader(rows[0]);
        });

        test("Should show a table when data", async () => {
            const products = givenProducts(mockWebServer);

            myCustomRender(<ProductsPage />);

            await waitUntilTableIsLoaded();

            const [header, ...rows] = await screen.findAllByRole("row");

            verifyHeader(header);
            // @ts-expect-error JSON data is not typed
            verifyRows(rows, products);
        });
    });

    describe("Edit price", () => {
        test("Should show a dialog when clicking on a row", async () => {
            const products = givenProducts(mockWebServer);

            myCustomRender(<ProductsPage />);

            await waitUntilTableIsLoaded();

            const dialog = await openDialogToEditPrice(0);

            // @ts-expect-error JSON data is not typed
            verifyDialog(dialog, products[0]);
        });

        test("Show an error when price is negative", async () => {
            givenProducts(mockWebServer);

            myCustomRender(<ProductsPage />);

            await waitUntilTableIsLoaded();

            const dialog = await openDialogToEditPrice(0);

            await typePrice(dialog, "-10");

            await verifyError(dialog, "Invalid price format");
        });

        test("Show an error when price is non numeric", async () => {
            givenProducts(mockWebServer);

            myCustomRender(<ProductsPage />);

            await waitUntilTableIsLoaded();

            const dialog = await openDialogToEditPrice(0);

            await typePrice(dialog, "hola");

            await verifyError(dialog, "Only numbers are allowed");
        });

        test("Show an error when price is over 999.99", async () => {
            givenProducts(mockWebServer);

            myCustomRender(<ProductsPage />);

            await waitUntilTableIsLoaded();

            const dialog = await openDialogToEditPrice(0);

            await typePrice(dialog, "1000");

            await verifyError(dialog, "The max possible price is 999.99");
        });

        test("Should edit price correctly", async () => {
            givenProducts(mockWebServer);

            myCustomRender(<ProductsPage />);

            await waitUntilTableIsLoaded();

            const dialog = await openDialogToEditPrice(0);

            const newPrice = "120.99";

            await typePrice(dialog, newPrice);

            await savePrice(dialog);

            await verifyPriceAndStatusInRow(0, newPrice, "active");
        });

        test("Should edit price as 0 correctly", async () => {
            givenProducts(mockWebServer);

            myCustomRender(<ProductsPage />);

            await waitUntilTableIsLoaded();

            const dialog = await openDialogToEditPrice(0);

            const newPrice = "0";

            await typePrice(dialog, newPrice);

            await savePrice(dialog);

            await verifyPriceAndStatusInRow(0, newPrice, "inactive");
        });
    });
});
