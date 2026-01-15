import { useCallback } from "react";

import { useUser } from "@/hooks/useUser";

export const usePermission = () => {
    const { user } = useUser();

    const can = useCallback(
        (permission: string) => {
            if (!user) return false;
            if (!user) return false;

            return user.permissions?.includes(permission) ?? false;
        },
        [user],
    );

    const hasRole = useCallback(
        (role: string | string[]) => {
            if (!user) return false;
            if (Array.isArray(role)) {
                return user.roles?.some((r) => role.includes(r.name)) ?? false;
            }

            return user.roles?.some((r) => r.name === role) ?? false;
        },
        [user],
    );

    return { can, hasRole };
};
