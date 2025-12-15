import { useNavigate } from "@tanstack/react-router";

import { Layout } from "@/features/Layout";
import { authStore } from "@/store/auth.store";

export const NotFound = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = authStore();

    if (!isAuthenticated) {
        navigate({ to: "/login" });
    }

    return (
        <Layout>
            <div
                key={"warning"}
                className="w-full h-full flex flex-col items-center justify-center gap-2 my-3"
            >
                <p className="text-2xl font-bold">404</p>
                <p className="text-2xl font-bold">Page not found</p>
            </div>
        </Layout>
    );
};
