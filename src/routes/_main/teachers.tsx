import { createFileRoute } from "@tanstack/react-router";
import { Teacher } from "@/features/Teacher";
export const Route = createFileRoute("/_main/teachers")({
    component: Teacher,
});
