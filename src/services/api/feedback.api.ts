import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type FeedbackItemType = {
    created_at: string;
    description: string;
    id: number;
    lang: string;
    updated_at: string;
    lang_hash: string;
    full_name: string;
    position: string;
    sort: string;
    status: number;
    type: number;
    video: {
        id: number;
    } | null;
    translations: {
        id: number;
        lang: string;
    }[];
};

export const FeedbackApi = {
    getFeedbacks: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/reviews", {
            params,
        });

        return response;
    },
    getFeedback: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/reviews/${id}`, {
            params: {
                include: "video",
            },
        });

        return response;
    },

    createFeedback: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/reviews", data);

        return response;
    },

    updateFeedback: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/reviews/${id}`, data);

        return response;
    },

    deleteFeedback: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/reviews/${id}`);

        return response;
    },
};
