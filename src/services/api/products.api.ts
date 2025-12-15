import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type ProductItemType = {
    id: number;
    name: string;
    type: string;
    definition: string;
    duration: number;
    price: string;
    currency: string;
    sort_order: number;
    status: number;
    created_at: string;
    updated_at: string;
};

export const productsApi = {
    getProducts: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/products", {
            params,
        });

        return response;
    },

    createProduct: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/products", data);

        return response;
    },

    updateProduct: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/products/${id}`, data);

        return response;
    },

    deleteProduct: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/products/${id}`);

        return response;
    },
};
