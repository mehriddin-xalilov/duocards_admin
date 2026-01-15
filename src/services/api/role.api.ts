import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type RoleType = {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions?: PermissionType[];
};

export type PermissionType = {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
};

export type GroupedPermission = {
    resource: string;
    permissions: {
        id: number;
        name: string;
        action: string | null;
    }[];
};

export const roleApi = {
    getRoles: async <T>() => {
        const response: ResponseDataType<T> = await apiInstance.get("/roles");
        return response;
    },

    getRole: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/roles/${id}`);
        return response;
    },

    createRole: async <T>(data: { name: string; permissions?: string[] }) => {
        const response: ResponseDataType<T> = await apiInstance.post("/roles", data);
        return response;
    },

    updateRole: async <T>(id: number, data: { name: string; permissions?: string[] }) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/roles/${id}`, data);
        return response;
    },

    deleteRole: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.delete(`/roles/${id}`);
        return response;
    },
};

export const permissionApi = {
    getPermissions: async <T>() => {
        const response: ResponseDataType<T> = await apiInstance.get("/permissions");
        return response;
    },

    getPermission: async <T>(id: number) => {
        const response: ResponseDataType<T> = await apiInstance.get(`/permissions/${id}`);
        return response;
    },
};

export const userRoleApi = {
    assignRole: async <T>(userId: number, roles: string[]) => {
        const response: ResponseDataType<T> = await apiInstance.post(
            `/users/${userId}/assign-role`,
            { roles }
        );
        return response;
    },

    syncPermissions: async <T>(userId: number, permissions: string[]) => {
        const response: ResponseDataType<T> = await apiInstance.post(
            `/users/${userId}/sync-permissions`,
            { permissions }
        );
        return response;
    },
};
