import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type FaqItemType = {
    created_at: string;
    description: string;
    id: number;
    lang: string;
    updated_at: string;
    lang_hash: string;
    question: string;
    answer: string;
    status: number;
    sort: number;
    translations: {
        id: number;
        lang: string;
    }[];
};

export const faqApi = {
    getFaqs: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/faqs", {
            params,
        });
        return response;
    },
    getFaq: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/faqs/${id}`);
        return response;
    },

    createFaq: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/faqs", data);
        return response;
    },

    updateFaq: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/faqs/${id}`, data);
        return response;
    },

    deleteFaq: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/faqs/${id}`);
        return response;
    },
};
