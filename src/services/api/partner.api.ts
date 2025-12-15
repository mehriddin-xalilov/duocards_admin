import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type PartnerItemType = {
    created_at: string;
    name: string;
    id: number;
    lang: string;
    updated_at: string;
    lang_hash: string;
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

export const partnerApi = {
    getPartners: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/partners", {
            params,
        });

        return response;
    },
    getPartner: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/partners/${id}`, {
            params: {
                include: "icon",
            },
        });

        return response;
    },

    createPartner: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/partners", data);

        return response;
    },

    updatePartner: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/partners/${id}`, data);

        return response;
    },

    deletePartner: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/partners/${id}`);

        return response;
    },
};
