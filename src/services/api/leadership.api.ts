import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type LeaderShipItemType = {
    created_at: string;
    full_name: string;
    id: number;
    lang: string;
    updated_at: string;
    lang_hash: string;
    email: string;
    phone: string;
    position: string;
    resume: [
        {
            title: string;
            description: string;
        },
    ];
    status: number;
    sort: number;
    photo: {
        id: number;
    } | null;
    translations: {
        id: number;
        lang: string;
    }[];
};

export const leadershipApi = {
    getLeaderships: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/management", {
            params,
        });

        return response;
    },
    getLeaderShip: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/management/${id}`, {
            params: {
                include: "photo",
            },
        });

        return response;
    },

    createLeadership: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/management", data);

        return response;
    },

    updateLeadership: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/management/${id}`, data);

        return response;
    },

    deleteLeadership: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/management/${id}`);

        return response;
    },
};
