import * as React from "react";
import { ChevronDownIcon } from "@/components/Editor/Icons/chevron-down-icon";
import { Button } from "@/components/Editor/UiPrimitive/Button";
import { Card, CardBody } from "@/components/Editor/UiPrimitive/Card";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/Editor/UiPrimitive/dropdown-menu";

import { useFontSizeDropdownMenu } from "@/components/Editor/Ui/fontsize-dropdown-menu/use-fontsize-dropdown-menu";

export interface FontSizeDropdownMenuProps {
    editor?: any;
    portal?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
}

export const FontSizeDropdownMenu = React.forwardRef<HTMLButtonElement, FontSizeDropdownMenuProps>(
    ({ editor: providedEditor, portal = false, onOpenChange }, ref) => {
        const { isVisible, activeSize, sizes, editor } = useFontSizeDropdownMenu({
            editor: providedEditor,
        });

        const [isOpen, setIsOpen] = React.useState(false);

        const handleOpenChange = React.useCallback(
            (open: boolean) => {
                if (!editor) return;
                setIsOpen(open);
                onOpenChange?.(open);
            },
            [editor, onOpenChange],
        );

        if (!isVisible || !editor) return null;

        return (
            <DropdownMenu modal open={isOpen} onOpenChange={handleOpenChange}>
                <DropdownMenuTrigger asChild>
                    <Button
                        ref={ref}
                        aria-label="Change font size"
                        data-style="ghost"
                        role="button"
                        type="button"
                    >
                        {activeSize || "Size"}
                        <ChevronDownIcon className="tiptap-button-dropdown-small" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" portal={portal}>
                    <Card className="!rounded-md">
                        <CardBody className="max-h-64 max-w-[70px] randed-lg overflow-y-auto">
                            {sizes.map((size) => (
                                <DropdownMenuItem key={size} asChild>
                                    <button
                                        className="w-full text-left px-2 py-1 rounded-md hover:bg-gray-100"
                                        onClick={() => {
                                            editor.chain().focus().setFontSize(size).run();
                                            setIsOpen(false);
                                        }}
                                    >
                                        {size}
                                    </button>
                                </DropdownMenuItem>
                            ))}
                        </CardBody>
                    </Card>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
);

FontSizeDropdownMenu.displayName = "FontSizeDropdownMenu";
