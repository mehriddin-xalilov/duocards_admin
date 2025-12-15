import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/features/About";

export const Route = createFileRoute("/_main/about")({
    component: About,
});
