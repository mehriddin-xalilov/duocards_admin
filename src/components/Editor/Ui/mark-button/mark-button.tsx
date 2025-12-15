import * as React from "react";

// --- Lib ---

// --- Hooks ---

// --- Tiptap UI ---
import type { Mark, UseMarkConfig } from "@/components/Editor/Ui/mark-button";
import { MARK_SHORTCUT_KEYS, useMark } from "@/components/Editor/Ui/mark-button";

// --- UI Primitives ---
import { Badge } from "@/components/Editor/UiPrimitive/Badge";
import type { ButtonProps } from "@/components/Editor/UiPrimitive/Button";
import { Button } from "@/components/Editor/UiPrimitive/Button";

import { useTiptapEditor } from "@/components/Editor/hooks/use-tiptap-editor";
import { parseShortcutKeys } from "@/components/Editor/lib/utils/tiptap-utils";

export interface MarkButtonProps extends Omit<ButtonProps, "type">, UseMarkConfig {
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

export function MarkShortcutBadge({
    type,
    shortcutKeys = MARK_SHORTCUT_KEYS[type],
}: {
    type: Mark;
    shortcutKeys?: string;
}) {
    return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for toggling marks in a Tiptap editor.
 *
 * For custom button implementations, use the `useMark` hook instead.
 */
export const MarkButton = React.forwardRef<HTMLButtonElement, MarkButtonProps>(
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
        const { isVisible, handleMark, label, canToggle, isActive, Icon, shortcutKeys } = useMark({
            editor,
            type,
            hideWhenUnavailable,
            onToggled,
        });

        const handleClick = React.useCallback(
            (event: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                handleMark();
            },
            [handleMark, onClick],
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
                            <MarkShortcutBadge shortcutKeys={shortcutKeys} type={type} />
                        )}
                    </>
                )}
            </Button>
        );
    },
);

MarkButton.displayName = "MarkButton";
