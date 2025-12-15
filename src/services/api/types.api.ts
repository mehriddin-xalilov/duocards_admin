import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type TypesItemType = {
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

export const TypesApi = {
    getTypes: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/types", {
            params,
        });

        return response;
    },

    createTypes: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/types", data);

        return response;
    },

    updateTypes: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/types/${id}`, data);

        return response;
    },

    deleteTypes: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/types/${id}`);

        return response;
    },
};
