import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type QuoteItemType = {
    created_at: string;
    description: string;
    id: number;
    lang: string;
    updated_at: string;
    lang_hash: string;
    name: string;
    sort: number;
    photo: {
        id: number;
    } | null;
    translations: {
        id: number;
        lang: string;
    }[];
};

export const quoteApi = {
    getQuotes: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/quotes", {
            params,
        });

        return response;
    },
    getQuote: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/quotes/${id}`, {
            params: {
                include: "photo",
            },
        });

        return response;
    },

    createQuote: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/quotes", data);

        return response;
    },

    updateQuote: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/quotes/${id}`, data);

        return response;
    },

    deleteQuote: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/quotes/${id}`);

        return response;
    },
};
