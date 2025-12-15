import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/components/Editor/lib/utils/tiptap-utils";
import "@/components/Editor/UiPrimitive/Popover/Popover.scss";

function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
    return <PopoverPrimitive.Root {...props} />;
}

function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
    return <PopoverPrimitive.Trigger {...props} />;
}

function PopoverContent({
    className,
    align = "center",
    sideOffset = 4,
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                align={align}
                className={cn("tiptap-popover", className)}
                sideOffset={sideOffset}
                {...props}
            />
        </PopoverPrimitive.Portal>
    );
}

export { Popover, PopoverTrigger, PopoverContent };
