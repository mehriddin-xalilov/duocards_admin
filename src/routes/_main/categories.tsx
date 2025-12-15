import { createFileRoute } from "@tanstack/react-router";

import { Categories } from "@/features/Categories";
export const Route = createFileRoute("/_main/categories")({
    component: Categories,
});
