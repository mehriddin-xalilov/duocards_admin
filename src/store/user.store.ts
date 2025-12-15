import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface UserType {
    id: number;
    name: string;
    login: string;
    email: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    user_role: {
        id: number;
        role: string;
        user_id: number;
        created_at: string;
        updated_at: string;
    };
}

interface UserStore {
    user: UserType | null;
    token: string | null;
    setUser: (user: UserType | null, token: string | null) => void;
}

export const userStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setUser: (user, token) => set({ user, token }),
        }),
        { name: "user", storage: createJSONStorage(() => localStorage) },
    ),
);
