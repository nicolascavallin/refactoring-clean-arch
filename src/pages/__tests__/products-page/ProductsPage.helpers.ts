import { screen, waitFor, within } from "@testing-library/dom";
import { expect } from "vitest";
import { Product } from "../../ProductsPage";
import { userEvent } from "@testing-library/user-event";

export function verifyHeader(header: HTMLElement) {
    const headerScope = within(header);

    const cells = headerScope.getAllByRole("columnheader");

    expect(cells).toHaveLength(6);

    within(cells[0]).getByText("ID");
    within(cells[1]).getByText("Title");
    within(cells[2]).getByText("Image");
    within(cells[3]).getByText("Price");
    within(cells[4]).getByText("Status");
}

export async function waitUntilTableIsLoaded() {
    return await waitFor(async () =>
        expect((await screen.findAllByRole("row")).length).toBeGreaterThan(1)
    );
}

export function verifyRows(rows: HTMLElement[], products: Product[]) {
    expect(rows).toHaveLength(products.length);

    rows.forEach((row, index) => {
        const scope = within(row);

        const cells = scope.getAllByRole("cell");

        const productApi = products[index];

        expect(cells).toHaveLength(6);

        within(cells[0]).getByText(productApi.id.toString()); // scope.getByText(productApi.id.toString());
        within(cells[1]).getByText(productApi.title); // scope.getByText(productApi.title);
        const image = within(cells[2]).getByRole("img");
        expect(image).toHaveAttribute("src", productApi.image);
        within(cells[3]).getByText(`$${Number(productApi.price).toFixed(2)}`);
        within(cells[4]).getByText(productApi.price === "0" ? "inactive" : "active");
    });
}

export async function openDialogToEditPrice(index: number): Promise<HTMLElement> {
    const [, ...rows] = screen.getAllByRole("row");

    const row = rows[index];

    const scope = within(row);

    await userEvent.click(scope.getByRole("menuitem"));

    const updatePriceMenu = await screen.findByRole("menuitem", { name: /update price/i });

    await userEvent.click(updatePriceMenu);

    return await screen.findByRole("dialog");
}

export function verifyDialog(dialog: HTMLElement, product: Product) {
    const scope = within(dialog);

    scope.getByText("Update price");

    scope.getByText(product.title);

    const image = scope.getByRole("img");
    expect(image).toHaveAttribute("src", product.image);

    const input = scope.getByRole("textbox");

    expect(input).toHaveValue(Number(product.price).toFixed(2));
}
