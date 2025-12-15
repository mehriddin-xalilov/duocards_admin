import { useEffect } from "react";

import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";

import { Layout } from "@/features/Layout";
import { useAuthGuard } from "@/guards/authGuard";
import { authStore } from "@/store/auth.store";

export const Route = createFileRoute("/_main")({
    component: RouteComponent,
    beforeLoad: useAuthGuard,
});

function RouteComponent() {
    const { isAuthenticated } = authStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate({ to: "/login" });
        }
    }, [isAuthenticated]);

    return (
        <Layout>
            <Outlet />
        </Layout>
    );
}
