import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type SettingItemType = {
    name: string;
    btn_text: string;
    link: string;
    alias: string;
    lang: string;
    lang_hash: string;
    sort: number;
    id: number;
    status: boolean;
    photo: {
        id: number;
    } | null;
    translations: {
        id: number;
        lang: string;
    }[];
};

export const SettingsApi = {
    getSettings: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/settings", {
            params,
        });

        return response;
    },
    getSetting: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/settings/${id}`, {
            params: {
                include: "photo",
            },
        });

        return response;
    },

    createSetting: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/settings", data);

        return response;
    },

    updateSetting: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/settings/${id}`, data);

        return response;
    },

    deleteSetting: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/settings/${id}`);

        return response;
    },
};
