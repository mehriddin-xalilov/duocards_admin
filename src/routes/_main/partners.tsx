import { createFileRoute } from "@tanstack/react-router";
import { Partner } from "@/features/Partner";
export const Route = createFileRoute("/_main/partners")({
    component: Partner,
});
