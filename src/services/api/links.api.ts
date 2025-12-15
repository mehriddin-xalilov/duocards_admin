import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type LinksItemType = {
    created_at: string;
    id: number;
    lang: string;
    updated_at: string;
    lang_hash: string;
    name: {
        uz: string;
        ru: string;
        en: string;
        oz: string;
    };
    link: string;
    status: number;
    sort: number;
    logo: {
        id: number;
    } | null;
    translations: {
        id: number;
        lang: string;
    }[];
};

export const linksApi = {
    getLinks: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/links", {
            params,
        });

        return response;
    },
    getLink: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/links/${id}`, {
            params: {
                include: "icon",
            },
        });

        return response;
    },

    createLink: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/links", data);

        return response;
    },

    updateLink: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/links/${id}`, data);

        return response;
    },

    deleteLink: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/links/${id}`);

        return response;
    },
};
