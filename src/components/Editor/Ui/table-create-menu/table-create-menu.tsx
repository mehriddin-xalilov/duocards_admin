import React, { useState } from "react";
import { Table } from "lucide-react";
import { type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/components/Editor/hooks/use-tiptap-editor";

// --- Icons ---
import { ChevronDownIcon } from "@/components/Editor/Icons/chevron-down-icon";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/Editor/UiPrimitive/Button";
import { Button } from "@/components/Editor/UiPrimitive/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Editor/UiPrimitive/Popover";

// --- Constants ---
import {
    TABLE_DEFAULT_SELECTED_GRID_SIZE,
    TABLE_INIT_GRID_SIZE,
    TABLE_MAX_GRID_SIZE,
} from "@/components/Editor/constants";

const createArray = (length: number) => Array.from({ length }).map((_, index) => index + 1);

export interface GridSize {
    rows: number;
    cols: number;
}

export interface CreateTablePayload extends GridSize {
    withHeaderRow: boolean;
}

export interface ListDropdownMenuProps extends Omit<ButtonProps, "type"> {
    editor?: Editor;
    onOpenChange?: (isOpen: boolean) => void;
}

export function TableCreateMenu({
    editor: providedEditor,
    onOpenChange,
    ...props
}: ListDropdownMenuProps) {
    const { editor } = useTiptapEditor(providedEditor);
    const [isOpen, setIsOpen] = React.useState(false);

    const [withHeaderRow, setWithHeaderRow] = useState<boolean>(true);
    const [tableGridSize, setTableGridSize] = useState<GridSize>({
        rows: TABLE_INIT_GRID_SIZE,
        cols: TABLE_INIT_GRID_SIZE,
    });

    const [selectedTableGridSize, setSelectedTableGridSize] = useState<GridSize>({
        rows: TABLE_DEFAULT_SELECTED_GRID_SIZE,
        cols: TABLE_DEFAULT_SELECTED_GRID_SIZE,
    });

    function selectTableGridSize(rows: number, cols: number): void {
        if (rows === tableGridSize.rows) {
            setTableGridSize((prev) => {
                return {
                    ...prev,
                    rows: Math.min(rows + 1, TABLE_MAX_GRID_SIZE),
                };
            });
        }

        if (cols === tableGridSize.cols) {
            setTableGridSize((prev) => {
                return {
                    ...prev,
                    cols: Math.min(cols + 1, TABLE_MAX_GRID_SIZE),
                };
            });
        }

        setSelectedTableGridSize({
            rows,
            cols,
        });
    }

    function onMouseDown(rows: number, cols: number) {
        if (editor) {
            editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run();

            resetTableGridSize();
        }
    }

    function resetTableGridSize(): void {
        setWithHeaderRow(false);

        setTableGridSize({
            rows: TABLE_INIT_GRID_SIZE,
            cols: TABLE_INIT_GRID_SIZE,
        });

        setSelectedTableGridSize({
            rows: TABLE_DEFAULT_SELECTED_GRID_SIZE,
            cols: TABLE_DEFAULT_SELECTED_GRID_SIZE,
        });
    }

    const handleOnOpenChange = React.useCallback(
        (open: boolean) => {
            setIsOpen(open);
            onOpenChange?.(open);
        },
        [onOpenChange],
    );

    if (!editor || !editor.isEditable) {
        return null;
    }

    return (
        <Popover modal open={isOpen} onOpenChange={handleOnOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    aria-label="Table"
                    data-active-state={"off"}
                    data-style="ghost"
                    role="button"
                    tabIndex={-1}
                    tooltip="Table"
                    type="button"
                    {...props}
                >
                    <Table className="tiptap-button-icon" />
                    <ChevronDownIcon className="tiptap-button-dropdown-small" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="w-full bg-white rounded-xl shadow-lg border border-gray-200"
                side="bottom"
            >
                <div className="p-1 m-2">
                    <div className="flex flex-col flex-wrap justify-between gap-1">
                        {createArray(tableGridSize?.rows)?.map((row: any) => (
                            <div key={`r-${row}`} className="flex gap-1">
                                {createArray(tableGridSize?.cols)?.map((col: any) => {
                                    const isActive =
                                        col <= selectedTableGridSize.cols &&
                                        row <= selectedTableGridSize.rows;

                                    return (
                                        <div
                                            key={`c-${col}`}
                                            className={`cursor-pointer border ${
                                                isActive ? "bg-foreground rounded-[2px]" : ""
                                            }`}
                                            onClick={() => handleOnOpenChange(false)}
                                            onMouseDown={() => onMouseDown(row, col)}
                                            onMouseOver={() => selectTableGridSize(row, col)}
                                        >
                                            <div className="box-border w-3 h-3 rounded-[2px] border border-solid border-border p-1" />
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="mt-2 text-center text-sm text-zinc-600">
                        {selectedTableGridSize.rows} x {selectedTableGridSize.cols}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
