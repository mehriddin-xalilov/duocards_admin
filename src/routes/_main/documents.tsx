import { createFileRoute } from "@tanstack/react-router";
import { Documents } from "@/features/Documents";
export const Route = createFileRoute("/_main/documents")({
    component: Documents,
});
