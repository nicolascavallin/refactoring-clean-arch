import { MockWebServer } from "../../../../test/MockWebServer";
import ResponseJSON from "./data/response.json";

export function givenProducts(mockWebServer: MockWebServer) {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "https://fakestoreapi.com/products",
            httpStatusCode: 200,
            response: ResponseJSON,
        },
    ]);

    return ResponseJSON;
}

export function givenEmptyProducts(mockWebServer: MockWebServer) {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "https://fakestoreapi.com/products",
            httpStatusCode: 200,
            response: [],
        },
    ]);
}
