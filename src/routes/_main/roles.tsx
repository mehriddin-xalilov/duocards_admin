import { createFileRoute } from "@tanstack/react-router";

import { Roles } from "@/features/Roles";

export const Route = createFileRoute("/_main/roles")({
    component: Roles,
});
