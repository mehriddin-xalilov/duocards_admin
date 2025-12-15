import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type DocumentItemType = {
    created_at: string;
    id: number;
    lang: string;
    updated_at: string;
    documents: [];
    lang_hash: string;
    sort: Number;
    title: {
        oz: string;
        ru: string;
        en: string;
        uz: string;
    };
    status: number;
    // photo: {
    //     id: number;
    // } | null;
    translations: {
        id: number;
        lang: string;
    }[];
};

export const documentApi = {
    getDocuments: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/documents", {
            params,
        });

        return response;
    },
    getDocument: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/documents/${id}`, {
            params: {
                include: "icon",
            },
        });

        return response;
    },

    createDocument: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/documents", data);

        return response;
    },

    updateDocument: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/documents/${id}`, data);

        return response;
    },

    deleteDocument: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/documents/${id}`);

        return response;
    },
};
