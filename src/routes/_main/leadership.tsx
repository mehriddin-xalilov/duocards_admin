import { createFileRoute } from "@tanstack/react-router";
import { Leadership } from "@/features/Leadership";
export const Route = createFileRoute("/_main/leadership")({
    component: Leadership,
});
