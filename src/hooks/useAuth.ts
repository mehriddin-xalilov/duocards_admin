import { authStore } from "@/store/auth.store";
import { UserType, userStore } from "@/store/user.store";

export const useIsAuthenticated = () => {
    const { isAuthenticated } = authStore();

    return { isAuthenticated };
};

function loginHandler(user: UserType, token: string) {
    const { setUser } = userStore.getState();
    const { setIsAuthenticated } = authStore.getState();

    setUser(user, token);
    setIsAuthenticated(true);
}

function logoutHandler() {
    const { setUser } = userStore.getState();
    const { setIsAuthenticated } = authStore.getState();

    setUser(null, null);
    setIsAuthenticated(false);
}

export function useAuthHandler() {
    return { loginHandler, logoutHandler };
}
