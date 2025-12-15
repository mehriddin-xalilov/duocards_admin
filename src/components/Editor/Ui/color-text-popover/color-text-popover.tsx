import * as React from "react";

// --- Hooks ---
import { useMenuNavigation } from "@/components/Editor/hooks/use-menu-navigation";
import { useTiptapEditor } from "@/components/Editor/hooks/use-tiptap-editor";

// --- Icons ---
import { ChevronDownIcon } from "@/components/Editor/Icons/chevron-down-icon";

// --- Tiptap UI ---
import type {
    ColorType,
    ColorItem,
    RecentColor,
    UseColorTextPopoverConfig,
} from "@/components/Editor/Ui/color-text-popover";
import {
    useColorTextPopover,
    useRecentColors,
    getColorByValue,
} from "@/components/Editor/Ui/color-text-popover";
import { TEXT_COLORS, ColorTextButton } from "@/components/Editor/Ui/color-text-button";
import {
    HIGHLIGHT_COLORS,
    ColorHighlightButton,
} from "@/components/Editor/Ui/color-highlight-button";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/Editor/UiPrimitive/Button";
import { Button, ButtonGroup } from "@/components/Editor/UiPrimitive/Button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/Editor/UiPrimitive/Popover";
import {
    Card,
    CardBody,
    CardGroupLabel,
    CardItemGroup,
} from "@/components/Editor/UiPrimitive/Card";

// --- Utils ---
import { chunkArray } from "@/components/Editor/lib/utils/tiptap-advanced-utils";

// --- Styles ---
import "@/components/Editor/Ui/color-text-popover/color-text-popover.scss";

export interface RenderColorButtonProps extends ButtonProps {
    colorObj: RecentColor;
    withLabel?: boolean;
    onColorChanged?: ({
        type,
        label,
        value,
    }: {
        type: ColorType;
        label: string;
        value: string;
    }) => void;
}

export const RecentColorButton: React.FC<RenderColorButtonProps> = ({
    colorObj,
    withLabel = false,
    onColorChanged,
    ...props
}) => {
    const colorSet = colorObj.type === "text" ? TEXT_COLORS : HIGHLIGHT_COLORS;
    const color = getColorByValue(colorObj.value, colorSet);

    const commonProps = {
        tooltip: color.label,
        text: withLabel ? color.label : undefined,
        onApplied: () =>
            onColorChanged?.({
                type: colorObj.type,
                label: color.label,
                value: color.value,
            }),
        ...props,
    };

    return colorObj.type === "text" ? (
        <ColorTextButton label={color.label} textColor={color.value} {...commonProps} />
    ) : (
        <ColorHighlightButton highlightColor={color.value} {...commonProps} />
    );
};

export interface ColorGroupProps {
    type: ColorType;
    colors: ColorItem[][];
    onColorSelected: ({
        type,
        label,
        value,
    }: {
        type: ColorType;
        label: string;
        value: string;
    }) => void;
    selectedIndex?: number;
    startIndexOffset: number;
}

export const ColorGroup: React.FC<ColorGroupProps> = ({
    type,
    colors,
    onColorSelected,
    selectedIndex,
    startIndexOffset,
}) => {
    return colors.map((group, groupIndex) => (
        <ButtonGroup key={`${type}-group-${groupIndex}`} orientation="horizontal">
            {group.map((color, colorIndex) => {
                const itemIndex =
                    startIndexOffset +
                    colors.slice(0, groupIndex).reduce((acc, g) => acc + g.length, 0) +
                    colorIndex;

                const isHighlighted = selectedIndex === itemIndex;

                const commonProps = {
                    tooltip: color.label,
                    onApplied: () =>
                        onColorSelected({ type, label: color.label, value: color.value }),
                    tabIndex: isHighlighted ? 0 : -1,
                    "data-highlighted": isHighlighted,
                    "aria-label": `${color.label} ${type === "text" ? "text" : "highlight"} color`,
                };

                return type === "text" ? (
                    <ColorTextButton
                        key={`${type}-${color.value}-${colorIndex}`}
                        label={color.label}
                        textColor={color.value}
                        {...commonProps}
                    />
                ) : (
                    <ColorHighlightButton
                        key={`${type}-${color.value}-${colorIndex}`}
                        highlightColor={color.value}
                        {...commonProps}
                    />
                );
            })}
        </ButtonGroup>
    ));
};

interface RecentColorsSectionProps {
    recentColors: RecentColor[];
    onColorSelected: ({
        type,
        label,
        value,
    }: {
        type: ColorType;
        label: string;
        value: string;
    }) => void;
    selectedIndex?: number;
}

const RecentColorsSection: React.FC<RecentColorsSectionProps> = ({
    recentColors,
    onColorSelected,
    selectedIndex,
}) => {
    if (recentColors.length === 0) return null;

    return (
        <CardItemGroup>
            <CardGroupLabel>Recently used</CardGroupLabel>
            <ButtonGroup orientation="horizontal">
                {recentColors.map((colorObj, index) => (
                    <RecentColorButton
                        key={`recent-${colorObj.type}-${colorObj.value}`}
                        colorObj={colorObj}
                        data-highlighted={selectedIndex === index}
                        tabIndex={selectedIndex === index ? 0 : -1}
                        onColorChanged={onColorSelected}
                    />
                ))}
            </ButtonGroup>
        </CardItemGroup>
    );
};

export interface TextStyleColorPanelProps {
    maxColorsPerGroup?: number;
    maxRecentColors?: number;
    onColorChanged?: ({
        type,
        label,
        value,
    }: {
        type: ColorType;
        label: string;
        value: string;
    }) => void;
}

export const TextStyleColorPanel: React.FC<TextStyleColorPanelProps> = ({
    maxColorsPerGroup = 5,
    maxRecentColors = 3,
    onColorChanged,
}) => {
    const { recentColors, addRecentColor, isInitialized } = useRecentColors(maxRecentColors);

    const containerRef = React.useRef<HTMLDivElement>(null);

    const textColorGroups = React.useMemo(
        () => chunkArray(TEXT_COLORS, maxColorsPerGroup),
        [maxColorsPerGroup],
    );

    const highlightColorGroups = React.useMemo(
        () => chunkArray(HIGHLIGHT_COLORS, maxColorsPerGroup),
        [maxColorsPerGroup],
    );

    const allTextColors = React.useMemo(() => textColorGroups.flat(), [textColorGroups]);

    const allHighlightColors = React.useMemo(
        () => highlightColorGroups.flat(),
        [highlightColorGroups],
    );

    const textColorStartIndex = React.useMemo(
        () => (isInitialized ? recentColors.length : 0),
        [isInitialized, recentColors.length],
    );

    const highlightColorStartIndex = React.useMemo(
        () => textColorStartIndex + allTextColors.length,
        [textColorStartIndex, allTextColors.length],
    );

    const menuItems = React.useMemo(() => {
        const items = [];

        if (isInitialized && recentColors.length > 0) {
            items.push(
                ...recentColors.map((color) => ({
                    type: color.type,
                    value: color.value,
                    label: `Recent ${color.type === "text" ? "text" : "highlight"} color`,
                    group: "recent",
                })),
            );
        }

        items.push(
            ...allTextColors.map((color) => ({
                type: "text" as ColorType,
                value: color.value,
                label: color.label,
                group: "text",
            })),
        );

        items.push(
            ...allHighlightColors.map((color) => ({
                type: "highlight" as ColorType,
                value: color.value,
                label: color.label,
                group: "highlight",
            })),
        );

        return items;
    }, [isInitialized, recentColors, allTextColors, allHighlightColors]);

    const handleColorSelected = React.useCallback(
        ({ type, label, value }: { type: ColorType; label: string; value: string }) => {
            if (!containerRef.current) return false;

            const highlightedElement = containerRef.current.querySelector(
                '[data-highlighted="true"]',
            ) as HTMLElement;

            if (highlightedElement) {
                highlightedElement.click();
            }

            addRecentColor({ type, label, value });
            onColorChanged?.({ type, label, value });
        },
        [addRecentColor, onColorChanged],
    );

    const { selectedIndex } = useMenuNavigation({
        containerRef,
        items: menuItems,
        onSelect: (item) => {
            if (item) {
                handleColorSelected({
                    type: item.type,
                    label: item.label,
                    value: item.value,
                });
            }
        },
        orientation: "both",
        autoSelectFirstItem: false,
    });

    return (
        <Card ref={containerRef} role="menu" tabIndex={0}>
            <CardBody>
                {isInitialized && (
                    <RecentColorsSection
                        recentColors={recentColors}
                        selectedIndex={selectedIndex}
                        onColorSelected={handleColorSelected}
                    />
                )}

                <CardItemGroup>
                    <CardGroupLabel>Text color</CardGroupLabel>
                    <ColorGroup
                        colors={textColorGroups}
                        selectedIndex={selectedIndex}
                        startIndexOffset={textColorStartIndex}
                        type="text"
                        onColorSelected={handleColorSelected}
                    />
                </CardItemGroup>

                <CardItemGroup>
                    <CardGroupLabel>Highlight color</CardGroupLabel>
                    <ColorGroup
                        colors={highlightColorGroups}
                        selectedIndex={selectedIndex}
                        startIndexOffset={highlightColorStartIndex}
                        type="highlight"
                        onColorSelected={handleColorSelected}
                    />
                </CardItemGroup>
            </CardBody>
        </Card>
    );
};

export interface ColorTextPopoverProps
    extends Omit<ButtonProps, "type">,
        UseColorTextPopoverConfig {}

/**
 * Color text popover component for Tiptap editors.
 *
 * For custom popover implementations, use the `useColorTextPopover` hook instead.
 */
export const ColorTextPopover = React.forwardRef<HTMLButtonElement, ColorTextPopoverProps>(
    (
        {
            editor: providedEditor,
            hideWhenUnavailable = false,
            onColorChanged,
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
            canToggle,
            activeTextStyle,
            activeHighlight,
            handleColorChanged,
            label,
            Icon,
        } = useColorTextPopover({
            editor,
            hideWhenUnavailable,
            onColorChanged,
        });

        const handleClick = React.useCallback(
            (event: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                setIsOpen(!isOpen);
            },
            [onClick, isOpen, setIsOpen],
        );

        if (!isVisible) {
            return null;
        }

        return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        aria-label={label}
                        data-appearance="default"
                        data-disabled={!canToggle}
                        data-style="ghost"
                        disabled={!canToggle}
                        role="button"
                        tooltip={label}
                        type="button"
                        onClick={handleClick}
                        {...buttonProps}
                        ref={ref}
                    >
                        {children ?? (
                            <>
                                <span
                                    className="tiptap-button-color-text-popover"
                                    style={
                                        activeHighlight.color
                                            ? ({
                                                  "--active-highlight-color": activeHighlight.color,
                                              } as React.CSSProperties)
                                            : ({} as React.CSSProperties)
                                    }
                                >
                                    <Icon
                                        className="tiptap-button-icon"
                                        style={{
                                            color: activeTextStyle.color || undefined,
                                        }}
                                    />
                                </span>
                                <ChevronDownIcon className="tiptap-button-dropdown-small" />
                            </>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent align="start" aria-label="Text color options" side="bottom">
                    <TextStyleColorPanel onColorChanged={handleColorChanged} />
                </PopoverContent>
            </Popover>
        );
    },
);

ColorTextPopover.displayName = "ColorTextPopover";

export default ColorTextPopover;
