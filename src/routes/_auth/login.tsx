import { createFileRoute } from "@tanstack/react-router";

import { Login } from "@/features/Login";

export const Route = createFileRoute("/_auth/login")({
    component: Login,
});
