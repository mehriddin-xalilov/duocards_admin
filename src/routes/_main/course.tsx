import { createFileRoute } from "@tanstack/react-router";
import { Course } from "@/features/Course";

export const Route = createFileRoute("/_main/course")({
    component: Course,
});
