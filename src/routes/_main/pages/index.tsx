import { createFileRoute } from "@tanstack/react-router";

import { Pages } from "@/features/Pages";

export const Route = createFileRoute("/_main/pages/")({
    component: Pages,
    validateSearch: (search: Record<string, unknown>) => {
        return {
            // lang query paramni URL'dan oladi, bo‘lmasa "oz" qilib beradi
            lang: (search.lang as string) ?? "uz",
        };
    },
});
