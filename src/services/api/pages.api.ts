import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type PagesItemType = {
    id: number;
    title: string;
    slug: string;
    description: string;
    type: number;
    anons: string;
    lang: string;
    lang_hash: string;
    translations: {
        id: number;
        lang: string;
    }[];
};

export const pagesApi = {
    getPages: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/pages", {
            params,
        });

        return response;
    },
    getPage: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/pages/${id}`, {
            params: { include: "galleries,documents,managements" },
        });

        return response;
    },

    createPage: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/pages", data);

        return response;
    },

    updatePage: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/pages/${id}`, data);

        return response;
    },

    deletePage: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/pages/${id}`);

        return response;
    },
};
