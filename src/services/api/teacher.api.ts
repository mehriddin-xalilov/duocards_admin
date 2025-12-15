import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type TeacherItemType = {
    created_at: string;
    description: string;
    id: number;
    lang: string;
    updated_at: string;
    lang_hash: string;
    full_name: string;
    position: string;
    status: number;
    sort: string;
    photo: {
        id: number;
    } | null;
    video: {
        id: number;
    } | null;
    translations: {
        id: number;
        lang: string;
    }[];
};

export const teacherApi = {
    getTeachers: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/teachers", {
            params,
        });

        return response;
    },
    getTeacher: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/teachers/${id}`, {
            params: {
                include: "photo,video",
            },
        });

        return response;
    },

    createTeacher: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/teachers", data);

        return response;
    },

    updateTeacher: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/teachers/${id}`, data);

        return response;
    },

    deleteTeacher: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/teachers/${id}`);

        return response;
    },
};
