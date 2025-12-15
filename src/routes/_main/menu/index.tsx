import { createFileRoute } from "@tanstack/react-router";

import { Menu } from "@/features/Menu";
export const Route = createFileRoute("/_main/menu/")({
    component: Menu,
});
