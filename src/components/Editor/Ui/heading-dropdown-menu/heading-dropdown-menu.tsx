import * as React from "react";

// --- Icons ---
import { ChevronDownIcon } from "@/components/Editor/Icons/chevron-down-icon";

// --- Hooks ---

// --- Tiptap UI ---
import { HeadingButton } from "@/components/Editor/Ui/heading-button";
import type { UseHeadingDropdownMenuConfig } from "@/components/Editor/Ui/heading-dropdown-menu";
import { useHeadingDropdownMenu } from "@/components/Editor/Ui/heading-dropdown-menu";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/Editor/UiPrimitive/Button";
import { Button, ButtonGroup } from "@/components/Editor/UiPrimitive/Button";
import { Card, CardBody } from "@/components/Editor/UiPrimitive/Card";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/Editor/UiPrimitive/dropdown-menu";

import { useTiptapEditor } from "@/components/Editor/hooks/use-tiptap-editor";

export interface HeadingDropdownMenuProps
    extends Omit<ButtonProps, "type">,
        UseHeadingDropdownMenuConfig {
    /**
     * Whether to render the dropdown menu in a portal
     * @default false
     */
    portal?: boolean;
    /**
     * Callback for when the dropdown opens or closes
     */
    onOpenChange?: (isOpen: boolean) => void;
}

/**
 * Dropdown menu component for selecting heading levels in a Tiptap editor.
 *
 * For custom dropdown implementations, use the `useHeadingDropdownMenu` hook instead.
 */
export const HeadingDropdownMenu = React.forwardRef<HTMLButtonElement, HeadingDropdownMenuProps>(
    (
        {
            editor: providedEditor,
            levels = [1, 2, 3, 4, 5, 6],
            hideWhenUnavailable = false,
            portal = false,
            onOpenChange,
            ...buttonProps
        },
        ref,
    ) => {
        const { editor } = useTiptapEditor(providedEditor);
        const [isOpen, setIsOpen] = React.useState(false);
        const { isVisible, isActive, canToggle, Icon } = useHeadingDropdownMenu({
            editor,
            levels,
            hideWhenUnavailable,
        });

        const handleOpenChange = React.useCallback(
            (open: boolean) => {
                if (!editor || !canToggle) return;
                setIsOpen(open);
                onOpenChange?.(open);
            },
            [canToggle, editor, onOpenChange],
        );

        if (!isVisible) {
            return null;
        }

        return (
            <DropdownMenu modal open={isOpen} onOpenChange={handleOpenChange}>
                <DropdownMenuTrigger asChild>
                    <Button
                        aria-label="Format text as heading"
                        aria-pressed={isActive}
                        data-active-state={isActive ? "on" : "off"}
                        data-disabled={!canToggle}
                        data-style="ghost"
                        disabled={!canToggle}
                        role="button"
                        tabIndex={-1}
                        tooltip="Heading"
                        type="button"
                        {...buttonProps}
                        ref={ref}
                    >
                        <Icon className="tiptap-button-icon" />
                        <ChevronDownIcon className="tiptap-button-dropdown-small" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" portal={portal}>
                    <Card>
                        <CardBody>
                            <ButtonGroup>
                                {levels.map((level) => (
                                    <DropdownMenuItem key={`heading-${level}`} asChild>
                                        <HeadingButton
                                            editor={editor}
                                            level={level}
                                            showTooltip={false}
                                            text={`Heading ${level}`}
                                        />
                                    </DropdownMenuItem>
                                ))}
                            </ButtonGroup>
                        </CardBody>
                    </Card>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
);

HeadingDropdownMenu.displayName = "HeadingDropdownMenu";

export default HeadingDropdownMenu;
