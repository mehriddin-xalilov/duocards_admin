import { createFileRoute } from "@tanstack/react-router";
import { Banner } from "@/features/Banner";
export const Route = createFileRoute("/_main/banner")({
    component: Banner,
});
