import { createFileRoute } from "@tanstack/react-router";

import { User } from "@/features/User";
export const Route = createFileRoute("/_main/user")({
    component: User,
});
