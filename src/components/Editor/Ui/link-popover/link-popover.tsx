import * as React from "react";

// --- Hooks ---

// --- Icons ---
import { CornerDownLeftIcon } from "@/components/Editor/Icons/corner-down-left-icon";
import { ExternalLinkIcon } from "@/components/Editor/Icons/external-link-icon";
import { LinkIcon } from "@/components/Editor/Icons/link-icon";
import { TrashIcon } from "@/components/Editor/Icons/trash-icon";

// --- Tiptap UI ---
import type { UseLinkPopoverConfig } from "@/components/Editor/Ui/link-popover";
import { useLinkPopover } from "@/components/Editor/Ui/link-popover";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/Editor/UiPrimitive/Button";
import { Button, ButtonGroup } from "@/components/Editor/UiPrimitive/Button";
import { Card, CardBody, CardItemGroup } from "@/components/Editor/UiPrimitive/Card";
import { Input, InputGroup } from "@/components/Editor/UiPrimitive/Input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Editor/UiPrimitive/Popover";
import { Separator } from "@/components/Editor/UiPrimitive/Separator";

import type { Editor } from "@tiptap/react";

import { useIsMobile } from "@/components/Editor/hooks/use-mobile";
import { useTiptapEditor } from "@/components/Editor/hooks/use-tiptap-editor";

export interface LinkMainProps {
    /**
     * The URL to set for the link.
     */
    url: string;
    /**
     * Function to update the URL state.
     */
    setUrl: React.Dispatch<React.SetStateAction<string | null>>;
    /**
     * Function to set the link in the editor.
     */
    setLink: () => void;
    /**
     * Function to remove the link from the editor.
     */
    removeLink: () => void;
    /**
     * Function to open the link.
     */
    openLink: () => void;
    /**
     * Whether the link is currently active in the editor.
     */
    isActive: boolean;
}

export interface LinkPopoverProps extends Omit<ButtonProps, "type">, UseLinkPopoverConfig {
    /**
     * Callback for when the popover opens or closes.
     */
    onOpenChange?: (isOpen: boolean) => void;
    /**
     * Whether to automatically open the popover when a link is active.
     * @default true
     */
    autoOpenOnLinkActive?: boolean;
}

/**
 * Link button component for triggering the link popover
 */
export const LinkButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                aria-label="Link"
                className={className}
                data-style="ghost"
                role="button"
                tabIndex={-1}
                tooltip="Link"
                type="button"
                {...props}
            >
                {children || <LinkIcon className="tiptap-button-icon" />}
            </Button>
        );
    },
);

LinkButton.displayName = "LinkButton";

/**
 * Main content component for the link popover
 */
const LinkMain: React.FC<LinkMainProps> = ({
    url,
    setUrl,
    setLink,
    removeLink,
    openLink,
    isActive,
}) => {
    const isMobile = useIsMobile();

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault();
            setLink();
        }
    };

    return (
        <Card
            style={{
                ...(isMobile ? { boxShadow: "none", border: 0 } : {}),
            }}
        >
            <CardBody
                style={{
                    ...(isMobile ? { padding: 0 } : {}),
                }}
            >
                <CardItemGroup orientation="horizontal">
                    <InputGroup>
                        <Input
                            // autoFocus
                            autoCapitalize="off"
                            autoComplete="off"
                            autoCorrect="off"
                            placeholder="Paste a link..."
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </InputGroup>

                    <ButtonGroup orientation="horizontal">
                        <Button
                            data-style="ghost"
                            disabled={!url && !isActive}
                            title="Apply link"
                            type="button"
                            onClick={setLink}
                        >
                            <CornerDownLeftIcon className="tiptap-button-icon" />
                        </Button>
                    </ButtonGroup>

                    <Separator />

                    <ButtonGroup orientation="horizontal">
                        <Button
                            data-style="ghost"
                            disabled={!url && !isActive}
                            title="Open in new window"
                            type="button"
                            onClick={openLink}
                        >
                            <ExternalLinkIcon className="tiptap-button-icon" />
                        </Button>

                        <Button
                            data-style="ghost"
                            disabled={!url && !isActive}
                            title="Remove link"
                            type="button"
                            onClick={removeLink}
                        >
                            <TrashIcon className="tiptap-button-icon" />
                        </Button>
                    </ButtonGroup>
                </CardItemGroup>
            </CardBody>
        </Card>
    );
};

/**
 * Link content component for standalone use
 */
export const LinkContent: React.FC<{
    editor?: Editor | null;
}> = ({ editor }) => {
    const linkPopover = useLinkPopover({
        editor,
    });

    return <LinkMain {...linkPopover} />;
};

/**
 * Link popover component for Tiptap editors.
 *
 * For custom popover implementations, use the `useLinkPopover` hook instead.
 */
export const LinkPopover = React.forwardRef<HTMLButtonElement, LinkPopoverProps>(
    (
        {
            editor: providedEditor,
            hideWhenUnavailable = false,
            onSetLink,
            onOpenChange,
            autoOpenOnLinkActive = true,
            onClick,
            children,
            ...buttonProps
        },
        ref,
    ) => {
        const { editor } = useTiptapEditor(providedEditor);
        const [isOpen, setIsOpen] = React.useState(false);

        const {
            isVisible,
            canSet,
            isActive,
            url,
            setUrl,
            setLink,
            removeLink,
            openLink,
            label,
            Icon,
        } = useLinkPopover({
            editor,
            hideWhenUnavailable,
            onSetLink,
        });

        const handleOnOpenChange = React.useCallback(
            (nextIsOpen: boolean) => {
                setIsOpen(nextIsOpen);
                onOpenChange?.(nextIsOpen);
            },
            [onOpenChange],
        );

        const handleSetLink = React.useCallback(() => {
            setLink();
            setIsOpen(false);
        }, [setLink]);

        const handleClick = React.useCallback(
            (event: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                setIsOpen(!isOpen);
            },
            [onClick, isOpen],
        );

        React.useEffect(() => {
            if (autoOpenOnLinkActive && isActive) {
                setIsOpen(true);
            }
        }, [autoOpenOnLinkActive, isActive]);

        if (!isVisible) {
            return null;
        }

        return (
            <Popover open={isOpen} onOpenChange={handleOnOpenChange}>
                <PopoverTrigger asChild>
                    <LinkButton
                        aria-label={label}
                        aria-pressed={isActive}
                        data-active-state={isActive ? "on" : "off"}
                        data-disabled={!canSet}
                        disabled={!canSet}
                        onClick={handleClick}
                        {...buttonProps}
                        ref={ref}
                    >
                        {children ?? <Icon className="tiptap-button-icon" />}
                    </LinkButton>
                </PopoverTrigger>

                <PopoverContent>
                    <LinkMain
                        isActive={isActive}
                        openLink={openLink}
                        removeLink={removeLink}
                        setLink={handleSetLink}
                        setUrl={setUrl}
                        url={url}
                    />
                </PopoverContent>
            </Popover>
        );
    },
);

LinkPopover.displayName = "LinkPopover";

export default LinkPopover;
