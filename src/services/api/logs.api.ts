import { apiInstance } from "@/services/api";
import { GetParams, ResponseDataType } from "@/services/api/types";

export type LogsParams = {
    id: number;
    title: string;
    slug: string;
    description: string;
    type: number;
    anons: string;
    lang: string;
    lang_hash: string;
    translations: {
        id: number;
        lang: string;
    }[];
};

export const logsApi = {
    getLogs: async <T>(params: GetParams) => {
        const response: ResponseDataType<T> = await apiInstance.get("/audits", {
            params,
        });

        return response;
    },
};
