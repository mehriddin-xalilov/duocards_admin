import { createFileRoute } from "@tanstack/react-router";

import FileManager from "@/components/FileManager";
export const Route = createFileRoute("/_main/media")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="flex flex-col w-full h-full p-3">
            <FileManager />
        </div>
    );
}
