import { useEffect } from "react";

import { Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import { authStore } from "@/store/auth.store";

export const Route = createFileRoute("/_auth")({
    component: RouteComponent,
    beforeLoad: () => {
        const { isAuthenticated } = authStore.getState();

        if (isAuthenticated) {
            throw redirect({ to: "/" });
        }
    },
});

function RouteComponent() {
    const { isAuthenticated } = authStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate({ to: "/" });
        }
    }, [isAuthenticated]);

    return <Outlet />;
}
