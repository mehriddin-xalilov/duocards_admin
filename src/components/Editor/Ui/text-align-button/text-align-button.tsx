import * as React from "react";

// --- Lib ---

// --- Hooks ---

// --- Tiptap UI ---
import type { TextAlign, UseTextAlignConfig } from "@/components/Editor/Ui/text-align-button";
import { TEXT_ALIGN_SHORTCUT_KEYS, useTextAlign } from "@/components/Editor/Ui/text-align-button";

// --- UI Primitives ---
import { Badge } from "@/components/Editor/UiPrimitive/Badge";
import type { ButtonProps } from "@/components/Editor/UiPrimitive/Button";
import { Button } from "@/components/Editor/UiPrimitive/Button";

import { useTiptapEditor } from "@/components/Editor/hooks/use-tiptap-editor";
import { parseShortcutKeys } from "@/components/Editor/lib/utils/tiptap-utils";

type IconProps = React.SVGProps<SVGSVGElement>;
type IconComponent = ({ className, ...props }: IconProps) => React.ReactElement;

export interface TextAlignButtonProps extends Omit<ButtonProps, "type">, UseTextAlignConfig {
    /**
     * Optional text to display alongside the icon.
     */
    text?: string;
    /**
     * Optional show shortcut keys in the button.
     * @default false
     */
    showShortcut?: boolean;
    /**
     * Optional custom icon component to render instead of the default.
     */
    icon?: React.MemoExoticComponent<IconComponent> | React.FC<IconProps>;
}

export function TextAlignShortcutBadge({
    align,
    shortcutKeys = TEXT_ALIGN_SHORTCUT_KEYS[align],
}: {
    align: TextAlign;
    shortcutKeys?: string;
}) {
    return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for setting text alignment in a Tiptap editor.
 *
 * For custom button implementations, use the `useTextAlign` hook instead.
 */
export const TextAlignButton = React.forwardRef<HTMLButtonElement, TextAlignButtonProps>(
    (
        {
            editor: providedEditor,
            align,
            text,
            hideWhenUnavailable = false,
            onAligned,
            showShortcut = false,
            onClick,
            icon: CustomIcon,
            children,
            ...buttonProps
        },
        ref,
    ) => {
        const { editor } = useTiptapEditor(providedEditor);
        const { isVisible, handleTextAlign, label, canAlign, isActive, Icon, shortcutKeys } =
            useTextAlign({
                editor,
                align,
                hideWhenUnavailable,
                onAligned,
            });

        const handleClick = React.useCallback(
            (event: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                handleTextAlign();
            },
            [handleTextAlign, onClick],
        );

        if (!isVisible) {
            return null;
        }

        const RenderIcon = CustomIcon ?? Icon;

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
                        <RenderIcon className="tiptap-button-icon" />
                        {text && <span className="tiptap-button-text">{text}</span>}
                        {showShortcut && (
                            <TextAlignShortcutBadge align={align} shortcutKeys={shortcutKeys} />
                        )}
                    </>
                )}
            </Button>
        );
    },
);

TextAlignButton.displayName = "TextAlignButton";
