import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type BannerItemType = {
    created_at: string;
    description: {
        oz: string;
        ru: string;
        en: string;
        uz: string;
    };
    id: number;
    lang: string;
    updated_at: string;
    lang_hash: string;
    title: {
        oz: string;
        ru: string;
        en: string;
        uz: string;
    };
    status: number;
    photo: {
        id: number;
    } | null;
    translations: {
        id: number;
        lang: string;
    }[];
};

export const bannerApi = {
    getBanners: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/banners", {
            params,
        });

        return response;
    },
    getBanner: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/banners/${id}`, {
            params: {
                include: "icon",
            },
        });

        return response;
    },

    createBanner: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/banners", data);

        return response;
    },

    updateBanner: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/banners/${id}`, data);

        return response;
    },

    deleteBanner: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/banners/${id}`);

        return response;
    },
};
