import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type GalleryType = {
    title: string;
    description: string;
    images: [
        {
            description_uz: string;
            description_oz: string;
            description_ru: string;
            description_en: string;
            photo: number;
        },
    ];
};

export const galleryApi = {
    getGalleries: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/galleries", {
            params,
        });

        return response;
    },
    getGallery: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/galleries/${id}`, {
            params: {
                include: "photos",
            },
        });

        return response;
    },

    createGallery: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/galleries", data);

        return response;
    },

    updateGallery: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/galleries/${id}`, data);

        return response;
    },

    deleteGallery: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/galleries/${id}`);

        return response;
    },
};
