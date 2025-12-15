import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";
export type VersionsParams = {
    id: number;
    type: number;
    updated_at: string;
    status: number;
    version: string;
};
export const versionsApi = {
    getVersions: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/versions", {
            params,
        });

        return response;
    },

    updateVersions: async <T>(id: number, data: T) => {
        const response: ResponseDataType<T> = await apiInstance.put(`/versions/${id}`, data);

        return response;
    },
};
