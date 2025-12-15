import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type EventItemType = {
    created_at: string;
    description: string;
    id: number;
    lang: string;
    updated_at: string;
    lang_hash: string;
    title: string;
    start_time: string;
    end_time: string;
    date: string;
    location: string;
    status: number;
    translations: {
        id: number;
        lang: string;
    }[];
};

export const eventApi = {
    getEvents: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/meetups", {
            params,
        });

        return response;
    },
    getEvent: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/meetups/${id}`);

        return response;
    },

    createEvent: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/meetups", data);

        return response;
    },

    updateEvent: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/meetups/${id}`, data);

        return response;
    },

    deleteEvent: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/meetups/${id}`);

        return response;
    },
};
