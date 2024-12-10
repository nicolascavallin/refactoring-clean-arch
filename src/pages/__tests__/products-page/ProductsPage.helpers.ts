import { within } from "@testing-library/dom";
import { expect } from "vitest";

export async function verifyHeader(header: HTMLElement) {
    const headerScope = within(header);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const cells = headerScope.getAllByRole("columnheader");

    expect(cells).toHaveLength(6);

    within(cells[0]).getByText("ID");
    within(cells[1]).getByText("Title");
    within(cells[2]).getByText("Image");
    within(cells[3]).getByText("Price");
    within(cells[4]).getByText("Status");
}
