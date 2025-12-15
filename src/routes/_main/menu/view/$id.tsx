import { createFileRoute } from "@tanstack/react-router";

import { MenuItems } from "@/features/Menu";
export const Route = createFileRoute("/_main/menu/view/$id")({
    component: MenuItems,
});
