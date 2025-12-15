import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type CourseItemType = {
    created_at: string;
    description: string;
    id: number;
    lang: string;
    updated_at: string;
    lang_hash: string;
    name: string;
    link: string;
    type_id?: string;
    status: number;
    icon: {
        id: number;
    } | null;
    translations: {
        id: number;
        lang: string;
    }[];
};

export const courseApi = {
    getCourses: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/courses", {
            params,
        });

        return response;
    },
    getCourse: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/courses/${id}`, {
            params: {
                include: "icon",
            },
        });

        return response;
    },

    createCourse: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/courses", data);

        return response;
    },

    updateCourse: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/courses/${id}`, data);

        return response;
    },

    deleteCourse: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/courses/${id}`);

        return response;
    },
};
