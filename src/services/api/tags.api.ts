import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type TagsItemType = {
    id: number;
    title: string;
    status: number;
    sort: number;
    lang_hash: string;
};

export const TagsApi = {
    getTags: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/tags", {
            params,
        });

        return response;
    },

    createTags: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/tags", data);

        return response;
    },

    updateTags: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/tags/${id}`, data);

        return response;
    },

    deleteTags: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/tags/${id}`);

        return response;
    },
};
