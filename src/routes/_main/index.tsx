import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/")({
    component: () => null,
    beforeLoad: () => {
        throw redirect({ to: "/categories" });
    },
});
