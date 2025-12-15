import { createFileRoute } from "@tanstack/react-router";
import { Faq } from "@/features/Faq";
export const Route = createFileRoute("/_main/faqs")({
    component: Faq,
});
