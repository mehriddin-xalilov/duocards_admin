import { redirect } from "@tanstack/react-router";

import { authStore } from "@/store/auth.store";

export function useAuthGuard() {
    const { isAuthenticated } = authStore.getState();

    if (!isAuthenticated) {
        throw redirect({ to: "/login" });
    }
}
