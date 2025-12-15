import axios, { AxiosInstance, AxiosResponse } from "axios";

import { authStore } from "@/store/auth.store";
import { userStore } from "@/store/user.store";

function getToken(): string | null {
    const { token } = userStore.getState();

    return token;
}

export const apiInstance: AxiosInstance = axios.create({
    // baseURL: import.meta.env.VITE_API_BASE_URL,
    baseURL: "https://d171e95a4898.ngrok-free.app/api/v1/admin",
    timeout: 10000,
});

apiInstance.interceptors.request.use(
    (config) => {
        const token = getToken();

        if (!(config.data instanceof FormData)) {
            config.headers["Content-Type"] = "application/json; charset=utf-8";
            config.headers["Accept"] = "application/json";
            config.headers["Cache-Control"] = "no-cache";
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

apiInstance.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            const { setIsAuthenticated } = authStore.getState();
            const { setUser } = userStore.getState();

            setIsAuthenticated(false);
            setUser(null, null);
        }

        return Promise.reject(error);
    },
);
