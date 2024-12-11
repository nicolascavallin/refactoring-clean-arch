import { useEffect, useState } from "react";
import { useReload } from "../hooks/useReload";
import { Product } from "./ProductsPage";
import { GetProductsUseCase } from "../../domain/GetProducts";

export function useProducts(getProducts: GetProductsUseCase) {
    const [reloadKey, reload] = useReload();

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        getProducts.execute().then(prod => {
            console.debug("Reloading", reloadKey);
            setProducts(prod);
        });
    }, [getProducts, reloadKey]);

    return {
        products,
        reload,
    };
}
