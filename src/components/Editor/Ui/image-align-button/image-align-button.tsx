import * as React from "react";

// --- Lib ---
import { parseShortcutKeys } from "@/components/Editor/lib/utils/tiptap-utils";

// --- Hooks ---
import { useTiptapEditor } from "@/components/Editor/hooks/use-tiptap-editor";

// --- Tiptap UI ---
import type { ImageAlign, UseImageAlignConfig } from "@/components/Editor/Ui/image-align-button";
import {
    IMAGE_ALIGN_SHORTCUT_KEYS,
    useImageAlign,
} from "@/components/Editor/Ui/image-align-button";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/Editor/UiPrimitive/Button";
import { Button } from "@/components/Editor/UiPrimitive/Button";
import { Badge } from "@/components/Editor/UiPrimitive/Badge";

export interface ImageAlignButtonProps extends Omit<ButtonProps, "type">, UseImageAlignConfig {
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

export function ImageAlignShortcutBadge({
    align,
    shortcutKeys = IMAGE_ALIGN_SHORTCUT_KEYS[align],
}: {
    align: ImageAlign;
    shortcutKeys?: string;
}) {
    return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for setting image alignment in a Tiptap editor.
 *
 * For custom button implementations, use the `useImageAlign` hook instead.
 */
export const ImageAlignButton = React.forwardRef<HTMLButtonElement, ImageAlignButtonProps>(
    (
        {
            editor: providedEditor,
            align,
            text,
            extensionName,
            attributeName = "data-align",
            hideWhenUnavailable = false,
            onAligned,
            showShortcut = false,
            onClick,
            children,
            ...buttonProps
        },
        ref,
    ) => {
        const { editor } = useTiptapEditor(providedEditor);
        const { isVisible, handleImageAlign, label, canAlign, isActive, Icon, shortcutKeys } =
            useImageAlign({
                editor,
                align,
                extensionName,
                attributeName,
                hideWhenUnavailable,
                onAligned,
            });

        const handleClick = React.useCallback(
            (event: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                handleImageAlign();
            },
            [handleImageAlign, onClick],
        );

        if (!isVisible) {
            return null;
        }

        return (
            <Button
                aria-label={label}
                aria-pressed={isActive}
                data-active-state={isActive ? "on" : "off"}
                data-disabled={!canAlign}
                data-style="ghost"
                disabled={!canAlign}
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
                        {text ? <span>{text}</span> : null}
                        {showShortcut ? (
                            <ImageAlignShortcutBadge align={align} shortcutKeys={shortcutKeys} />
                        ) : null}
                    </>
                )}
            </Button>
        );
    },
);

ImageAlignButton.displayName = "ImageAlignButton";
