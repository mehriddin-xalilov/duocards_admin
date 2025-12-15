import { createFileRoute } from "@tanstack/react-router";
import { Links } from "@/features/Links";
export const Route = createFileRoute("/_main/links")({
    component: Links,
});
