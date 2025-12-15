import { createFileRoute } from "@tanstack/react-router";

import { News } from "@/features/News";

export const Route = createFileRoute("/_main/news/")({
    component: News,
    validateSearch: (search: Record<string, unknown>) => {
        return {
            lang: (search.lang as string) ?? "oz",
        };
    },
});
