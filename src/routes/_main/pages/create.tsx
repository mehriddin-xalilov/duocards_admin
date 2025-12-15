import { createFileRoute } from "@tanstack/react-router";

import { PageCreate } from "@/features/Pages";
export const Route = createFileRoute("/_main/pages/create")({
    component: PageCreate,
});
