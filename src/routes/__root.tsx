import React from "react";

import { ToastProvider } from "@heroui/react";
import { HeroUIProvider } from "@heroui/system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { NotFound } from "@/features/NotFound";
import { Wrapper } from "@/features/Wrapper";

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: NotFound,
});

function RootComponent() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                staleTime: 1000 * 60 * 10, // 10 minutes
                retry: false,
                placeholderData: (prev: any) => prev,
            },
        },
    });

    return (
        <React.Fragment>
            <QueryClientProvider client={queryClient}>
                <HeroUIProvider>
                    <Wrapper>
                        <Outlet />
                        <ToastProvider placement="top-right" />
                    </Wrapper>
                </HeroUIProvider>
            </QueryClientProvider>

            {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
        </React.Fragment>
    );
}
