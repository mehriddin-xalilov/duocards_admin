import { createFileRoute } from "@tanstack/react-router";

import { NewsUpdate } from "@/features/News";
export const Route = createFileRoute("/_main/news/update/$id")({
    component: NewsUpdate,
});
