import * as React from "react";

// --- Lib ---

// --- Tiptap UI ---
import type { Level, UseHeadingConfig } from "@/components/Editor/Ui/heading-button";
import { HEADING_SHORTCUT_KEYS, useHeading } from "@/components/Editor/Ui/heading-button";

// --- UI Primitives ---
import { Badge } from "@/components/Editor/UiPrimitive/Badge";
import type { ButtonProps } from "@/components/Editor/UiPrimitive/Button";
import { Button } from "@/components/Editor/UiPrimitive/Button";

import { useTiptapEditor } from "@/components/Editor/hooks/use-tiptap-editor";
import { parseShortcutKeys } from "@/components/Editor/lib/utils/tiptap-utils";

export interface HeadingButtonProps extends Omit<ButtonProps, "type">, UseHeadingConfig {
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

export function HeadingShortcutBadge({
    level,
    shortcutKeys = HEADING_SHORTCUT_KEYS[level],
}: {
    level: Level;
    shortcutKeys?: string;
}) {
    return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for toggling heading in a Tiptap editor.
 *
 * For custom button implementations, use the `useHeading` hook instead.
 */
export const HeadingButton = React.forwardRef<HTMLButtonElement, HeadingButtonProps>(
    (
        {
            editor: providedEditor,
            level,
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
        const { isVisible, canToggle, isActive, handleToggle, label, Icon, shortcutKeys } =
            useHeading({
                editor,
                level,
                hideWhenUnavailable,
                onToggled,
            });

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
                            <HeadingShortcutBadge level={level} shortcutKeys={shortcutKeys} />
                        )}
                    </>
                )}
            </Button>
        );
    },
);

HeadingButton.displayName = "HeadingButton";
