import * as React from "react";

// --- Lib ---

// --- Hooks ---

// --- UI Primitives ---
import type { ListType, UseListConfig } from "@/components/Editor/Ui/list-button";
import { LIST_SHORTCUT_KEYS, useList } from "@/components/Editor/Ui/list-button";
import { Badge } from "@/components/Editor/UiPrimitive/Badge";
import type { ButtonProps } from "@/components/Editor/UiPrimitive/Button";
import { Button } from "@/components/Editor/UiPrimitive/Button";

// --- Tiptap UI ---

import { useTiptapEditor } from "@/components/Editor/hooks/use-tiptap-editor";
import { parseShortcutKeys } from "@/components/Editor/lib/utils/tiptap-utils";

export interface ListButtonProps extends Omit<ButtonProps, "type">, UseListConfig {
    /**
     * Optional text to display alongside the icon.
     */
    text?: string;
    /**
     * Optional show shortcut keys in the button.
     * @default false
     */
    showShortcut?: boolean;
}

export function ListShortcutBadge({
    type,
    shortcutKeys = LIST_SHORTCUT_KEYS[type],
}: {
    type: ListType;
    shortcutKeys?: string;
}) {
    return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for toggling lists in a Tiptap editor.
 *
 * For custom button implementations, use the `useList` hook instead.
 */
export const ListButton = React.forwardRef<HTMLButtonElement, ListButtonProps>(
    (
        {
            editor: providedEditor,
            type,
            text,
            hideWhenUnavailable = false,
            onToggled,
            showShortcut = false,
            onClick,
            children,
            ...buttonProps
        },
        ref,
    ) => {
        const { editor } = useTiptapEditor(providedEditor);
        const { isVisible, canToggle, isActive, handleToggle, label, shortcutKeys, Icon } = useList(
            {
                editor,
                type,
                hideWhenUnavailable,
                onToggled,
            },
        );

        const handleClick = React.useCallback(
            (event: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                handleToggle();
            },
            [handleToggle, onClick],
        );

        if (!isVisible) {
            return null;
        }

        return (
            <Button
                aria-label={label}
                aria-pressed={isActive}
                data-active-state={isActive ? "on" : "off"}
                data-disabled={!canToggle}
                data-style="ghost"
                disabled={!canToggle}
                role="button"
                tabIndex={-1}
                tooltip={label}
                type="button"
                onClick={handleClick}
                {...buttonProps}
                ref={ref}
            >
                {children ?? (
                    <>
                        <Icon className="tiptap-button-icon" />
                        {text && <span className="tiptap-button-text">{text}</span>}
                        {showShortcut && (
                            <ListShortcutBadge shortcutKeys={shortcutKeys} type={type} />
                        )}
                    </>
                )}
            </Button>
        );
    },
);

ListButton.displayName = "ListButton";
