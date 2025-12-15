import { GetParams, ResponseDataType } from "./types";

import { apiInstance } from "@/services/api";
export type UploadResponse = {
    id: number;
    title: string;
    slug: string;
    ext: string;
    file: string;
    folder: string;
    size: number;
    defaultFiles: object;
    photo: object;
    thumbnails: {
        [key: string]: {
            slug: string;
            src: string;
        };
    };
};

export const fileApi = {
    upload: async (
        formData: FormData,
        options?: { signal?: AbortSignal },
    ): Promise<UploadResponse[]> => {
        const data = await apiInstance.post<UploadResponse[]>("/files/upload", formData, {
            signal: options?.signal,
            headers: { "Content-Type": "multipart/form-data" },
        });

        return data.data;
    },

    getFileManager: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/filemanager", {
            params,
        });

        return response;
    },

    deleteFile: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/files/${id}`);

        return response;
    },

    updateFile: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/files/${id}`, data);

        return response;
    },

    getFile: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/files/${id}`);

        return response;
    },
};
