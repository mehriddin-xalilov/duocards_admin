import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type MenuProps = {
    name: {
        uz: string;
        ru: string;
    };
    alias: string;

    sort: number;
    id: number;
    is_page: boolean;
    link: string;
    status: boolean;
    parent_id: number | null;
};

export type MenuItemProps = {
    menu_id: number;
    parent_id: number | null;
    name: {
        oz: string;
        uz: string;
        en: string;
        ru: string;
    };
    slug: string;

    sort: number;
    status: boolean;

    lang: string;
    type: number;
    id: number;
    lang_hash: string;
    translations: {
        id: number;
        lang: string;
    }[];
    icon: {
        id: number;
    };
};

export const MenusApi = {
    getMenus: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/menus", {
            params,
        });

        return response;
    },

    createMenu: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/menus", data);

        return response;
    },

    updateMenu: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/menus/${id}`, data);

        return response;
    },

    viewMenuItems: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/menu-items`, { params });

        return response;
    },

    deleteMenu: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/menus/${id}`);

        return response;
    },

    getMenuItems: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/menu-items", {
            params,
        });

        return response;
    },

    getMenuItem: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/menu-items", {
            params,
        });

        return response;
    },

    getMenuItemOne: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/menu-items/${id}`);

        return response;
    },

    createMenuItem: async <T>(data: T) => {
        const response: ResponseDataType<T> = await apiInstance.post("/menu-items", data);

        return response;
    },

    updateMenuItem: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/menu-items/${id}`, data);

        return response;
    },

    deleteMenuItem: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/menu-items/${id}`);

        return response;
    },

    getMenusForPage: async <T>() => {
        const response: ResponseDataType<T> = await apiInstance.get("/menu-items/by-menus");

        return response;
    },
};
