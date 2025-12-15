import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type UserType = {
    password: string;
    photo: {
        id: number;
    };
    is_team: boolean;
    is_columnist: boolean;
    name: string;
    email: string;
    login: string;
    sort: number;
    phone: string;
    status: string;
    socials: string;
    slug: string;
    details?: {
        firstname: string;
        lastname: string;
        position: string;
        bio: string;
        lang: string;
    };
    id: number;
    lang_hash?: string;
    user_role: { role: String };
};

export type ProfileType = {
    password: string;
    photo: {
        id: number;
    };

    name: string;
    email: string;
    login: string;
    sort: number;
    phone: string;

    id: number;
    user_role: { role: String };
};

export const userApi = {
    getUsers: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/user", {
            params,
        });

        return response;
    },

    getMe: async <T>() => {
        const response: ResponseDataType<T> = await apiInstance.get("/users/get-me", {
            params: { include: "photo" },
        });

        return response;
    },
    getUser: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/user/${id}`, {
            params: {
                include: "photo",
            },
        });

        return response;
    },

    createUser: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/user", data);

        return response;
    },

    updateUser: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/user/${id}`, data);

        return response;
    },

    updateUserMe: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/users/update-me`, data);

        return response;
    },

    updateUserDetails: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/details/${id}`, data);

        return response;
    },

    deleteUser: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/user/${id}`);

        return response;
    },
};
