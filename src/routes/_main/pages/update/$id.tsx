import { createFileRoute } from "@tanstack/react-router";

import { PageUpdate } from "@/features/Pages";
export const Route = createFileRoute("/_main/pages/update/$id")({
    component: PageUpdate,
});
