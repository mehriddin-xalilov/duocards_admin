import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type MainTagItemType = {
    title: string;
    slug: string;
    description: string;
    lang: string;
    lang_hash: string;
    status: number;
    id: number;
    sort: number;
    photo: {
        id: number;
    } | null;
    translations: {
        id: number;
        lang: string;
    }[];
};

export const MainTagApi = {
    getMainTags: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/main-tags", {
            params,
        });

        return response;
    },
    getMainTag: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/main-tags/${id}`, {
            params: {
                include: "photo",
            },
        });

        return response;
    },

    createMainTag: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/main-tags", data);

        return response;
    },

    updateMainTag: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/main-tags/${id}`, data);

        return response;
    },

    deleteMainTag: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/main-tags/${id}`);

        return response;
    },
};
