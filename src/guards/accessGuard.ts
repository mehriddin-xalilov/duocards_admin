import { BeforeLoadContextOptions, redirect } from "@tanstack/react-router";

import { getAccess } from "@/services/role";
import { userStore } from "@/store/user.store";

export function useAccessGuard(props: BeforeLoadContextOptions<any, any, any, any, any>) {
    const { location } = props;

    const { user } = userStore.getState();
    const role = user?.user_role.role;

    const path = location.pathname;

    if (!role || !path) {
        throw redirect({ to: "/404" });
    }

    if (!getAccess(role, path)) {
        throw redirect({ to: "/404" });
    }
}
