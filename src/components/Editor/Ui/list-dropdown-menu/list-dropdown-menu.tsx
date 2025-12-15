import * as React from "react";

import { type Editor } from "@tiptap/react";

// --- Hooks ---

// --- Icons ---
import { ChevronDownIcon } from "@/components/Editor/Icons/chevron-down-icon";

// --- Tiptap UI ---
import { ListButton, type ListType } from "@/components/Editor/Ui/list-button";

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

import { useListDropdownMenu } from "./use-list-dropdown-menu";

import { useTiptapEditor } from "@/components/Editor/hooks/use-tiptap-editor";

export interface ListDropdownMenuProps extends Omit<ButtonProps, "type"> {
    /**
     * The Tiptap editor instance.
     */
    editor?: Editor;
    /**
     * The list types to display in the dropdown.
     */
    types?: ListType[];
    /**
     * Whether the dropdown should be hidden when no list types are available
     * @default false
     */
    hideWhenUnavailable?: boolean;
    /**
     * Callback for when the dropdown opens or closes
     */
    onOpenChange?: (isOpen: boolean) => void;
    /**
     * Whether to render the dropdown menu in a portal
     * @default false
     */
    portal?: boolean;
}

export function ListDropdownMenu({
    editor: providedEditor,
    types = ["bulletList", "orderedList", "taskList"],
    hideWhenUnavailable = false,
    onOpenChange,
    portal = false,
    ...props
}: ListDropdownMenuProps) {
    const { editor } = useTiptapEditor(providedEditor);
    const [isOpen, setIsOpen] = React.useState(false);

    const { filteredLists, canToggle, isActive, isVisible, Icon } = useListDropdownMenu({
        editor,
        types,
        hideWhenUnavailable,
    });

    const handleOnOpenChange = React.useCallback(
        (open: boolean) => {
            setIsOpen(open);
            onOpenChange?.(open);
        },
        [onOpenChange],
    );

    if (!isVisible || !editor || !editor.isEditable) {
        return null;
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={handleOnOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-label="List options"
                    data-active-state={isActive ? "on" : "off"}
                    data-disabled={!canToggle}
                    data-style="ghost"
                    disabled={!canToggle}
                    role="button"
                    tabIndex={-1}
                    tooltip="List"
                    type="button"
                    {...props}
                >
                    <Icon className="tiptap-button-icon" />
                    <ChevronDownIcon className="tiptap-button-dropdown-small" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" portal={portal}>
                <Card>
                    <CardBody>
                        <ButtonGroup>
                            {filteredLists.map((option) => (
                                <DropdownMenuItem key={option.type} asChild>
                                    <ListButton
                                        editor={editor}
                                        showTooltip={false}
                                        text={option.label}
                                        type={option.type}
                                    />
                                </DropdownMenuItem>
                            ))}
                        </ButtonGroup>
                    </CardBody>
                </Card>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ListDropdownMenu;
