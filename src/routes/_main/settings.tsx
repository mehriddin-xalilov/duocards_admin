import { createFileRoute } from "@tanstack/react-router";

import { Settings } from "@/features/Settings";

export const Route = createFileRoute("/_main/settings")({
    component: Settings,
});
