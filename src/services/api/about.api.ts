import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type AboutItemType = {
    created_at: string;
    description: string;
    id: number;
    lang: string;
    updated_at: string;
    lang_hash: string;
    title: string;
    founded_at: string;
    lessons_count: string;
    all_listeners_count: string;
    finished_listeners_count: string;
    photo: {
        id: number;
    } | null;
    translations: {
        id: number;
        lang: string;
    }[];
};

export const aboutApi = {
    getAbouts: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/abouts", {
            params,
        });

        return response;
    },
    getAbout: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/abouts/${id}`, {
            params: {
                include: "photo",
            },
        });

        return response;
    },

    createAbout: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/abouts", data);

        return response;
    },

    updateAbout: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/abouts/${id}`, data);

        return response;
    },

    deleteAbout: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/abouts/${id}`);

        return response;
    },
};
