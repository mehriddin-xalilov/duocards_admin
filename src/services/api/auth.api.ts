import { apiInstance } from "@/services/api";

type LoginData = {
    login: string;
    password: string;
};

export const authApi = {
    login: (data: LoginData) => {
        return apiInstance.post("/auth/login", data);
    },
    logout: () => {
        return apiInstance.post("/auth/logout");
    },

    confirm: (phone: number, code: string) => {
        return apiInstance.post(`/auth/phone-confirm/${phone}?code=${code}`);
    },
};
