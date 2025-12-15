import { createFileRoute } from "@tanstack/react-router";
import { Event } from "@/features/Event";
export const Route = createFileRoute("/_main/event")({
    component: Event,
});
