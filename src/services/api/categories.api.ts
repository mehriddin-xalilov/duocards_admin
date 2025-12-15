import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type CategoriesItemType = {
    name: {
        uz: string;
        oz: string;
        ru: string;
        en: string;
    };
    parent_id: number;
    slug: string;
    main: number;
    status: number;
    sort: number;
    is_home: number;
    id: number;
};

export const CategoriesApi = {
    getCategories: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/categories", {
            params,
        });

        return response;
    },

    createCategories: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/categories", data);

        return response;
    },

    updateCategories: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/categories/${id}`, data);

        return response;
    },

    deleteCategories: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/categories/${id}`);

        return response;
    },
};
