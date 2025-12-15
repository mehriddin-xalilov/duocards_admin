import { createFileRoute } from "@tanstack/react-router";
import { Types } from "@/features/Types";
export const Route = createFileRoute("/_main/type")({
    component: Types,
});
