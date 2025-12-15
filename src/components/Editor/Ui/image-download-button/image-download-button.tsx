import * as React from "react";

// --- Lib ---
import { parseShortcutKeys } from "@/components/Editor/lib/utils/tiptap-utils";

// --- Hooks ---
import { useTiptapEditor } from "@/components/Editor/hooks/use-tiptap-editor";

// --- Tiptap UI ---
import type { UseImageDownloadConfig } from "@/components/Editor/Ui/image-download-button";
import {
    IMAGE_DOWNLOAD_SHORTCUT_KEY,
    useImageDownload,
} from "@/components/Editor/Ui/image-download-button";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/Editor/UiPrimitive/Button";
import { Button } from "@/components/Editor/UiPrimitive/Button";
import { Badge } from "@/components/Editor/UiPrimitive/Badge";

export interface ImageDownloadButtonProps
    extends Omit<ButtonProps, "type">,
        UseImageDownloadConfig {
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

export function ImageDownloadShortcutBadge({
    shortcutKeys = IMAGE_DOWNLOAD_SHORTCUT_KEY,
}: {
    shortcutKeys?: string;
}) {
    return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for downloading images from a Tiptap editor.
 * Only appears when an image is selected in the editor.
 *
 * For custom button implementations, use the `useImageDownload` hook instead.
 */
export const ImageDownloadButton = React.forwardRef<HTMLButtonElement, ImageDownloadButtonProps>(
    (
        {
            editor: providedEditor,
            text,
            hideWhenUnavailable = false,
            onDownloaded,
            resolveFileUrl,
            showShortcut = false,
            onClick,
            children,
            ...buttonProps
        },
        ref,
    ) => {
        const { editor } = useTiptapEditor(providedEditor);
        const { isVisible, canDownload, handleDownload, label, shortcutKeys, Icon } =
            useImageDownload({
                editor,
                hideWhenUnavailable,
                onDownloaded,
                resolveFileUrl,
            });

        const handleClick = React.useCallback(
            async (event: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                await handleDownload();
            },
            [handleDownload, onClick],
        );

        if (!isVisible) {
            return null;
        }

        return (
            <Button
                aria-label={label}
                data-active-state="off"
                data-disabled={!canDownload}
                data-style="ghost"
                disabled={!canDownload}
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
                        {showShortcut && <ImageDownloadShortcutBadge shortcutKeys={shortcutKeys} />}
                    </>
                )}
            </Button>
        );
    },
);

ImageDownloadButton.displayName = "ImageDownloadButton";
