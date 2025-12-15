import { createFileRoute } from "@tanstack/react-router";

import { NewsCreate } from "@/features/News";
export const Route = createFileRoute("/_main/news/create")({
    component: NewsCreate,
});
