import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type NewsItemType = {
    id: number;
    slug: string;
    title: string;
    description: string;
    type: string;
    viewed: number;
    publish_time: string;
    duration: string;
    content: string;
    status: boolean;
    time: string;
    date: string;
    lang_hash: string;
    image: string;
    photo: {
        icon: string;
        low: string;
        normal: string;
        original: string;
        small: string;
    };
    big_tag: {
        count: number;
        description: string;
        slug: string;
        title: string;
        photo: {
            icon: string;
            low: string;
            normal: string;
            original: string;
            small: string;
        };
    } | null;
    author: {
        count: number;
        firstname: string;
        id: number;
        lastname: string;
        photo: {
            icon: string;
            low: string;
            normal: string;
            original: string;
            small: string;
        };
        slug: string;
    };
    show_author: boolean;
    translations: {
        id: number;
        slug: string;
        lang: string;
    };
    categories: {
        id: number;
        slug: string;
        title: string;
        children: {
            id: number;
            title: string;
            slug: string;
        }[];
    };

    tags: {
        title: string;
        pivot: {
            post_id: number;
            tag_id: number;
        };
        slug: string;
        title_en: string;
        title_oz: string;
        title_ru: string;
        title_uz: string;
    };
};
export const newsApi = {
    getNews: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/posts", {
            params,
        });

        return response;
    },

    getNew: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/posts/${id}`, {
            params: { include: "photo,tags,categories,maintag,author,seo" },
        });

        return response;
    },

    createNews: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/posts", data);

        return response;
    },

    updateNews: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/posts/${id}`, data);

        return response;
    },

    deleteNews: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/posts/${id}`);

        return response;
    },
};
