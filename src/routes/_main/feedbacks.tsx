import { createFileRoute } from "@tanstack/react-router";
import { Feedback } from "@/features/Feedback";
export const Route = createFileRoute("/_main/feedbacks")({
    component: Feedback,
});
