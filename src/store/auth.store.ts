import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const authStore = create<AuthStore>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        }),
        { name: "auth", storage: createJSONStorage(() => localStorage) },
    ),
);
