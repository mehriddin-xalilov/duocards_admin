// --- UI Primitives ---
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "@/components/Editor/UiPrimitive/Toolbar";

// --- Tiptap UI ---
import { BlockquoteButton } from "@/components/Editor/Ui/blockquote-button";
import { HeadingDropdownMenu } from "@/components/Editor/Ui/heading-dropdown-menu";
import { LinkPopover, LinkButton } from "@/components/Editor/Ui/link-popover";
import { ListDropdownMenu } from "@/components/Editor/Ui/list-dropdown-menu";
import { MarkButton } from "@/components/Editor/Ui/mark-button";
import { TextAlignButton } from "@/components/Editor/Ui/text-align-button";
import { UndoRedoButton } from "@/components/Editor/Ui/undo-redo-button";

// --- Lib ---
import { FloatingElement } from "@/components/Editor/lib/ui-utils/floating-element";

export const FloatingElementTextSelection = ({
    editor,
    isMobile,
    onLinkClick,
}: {
    editor: any;
    isMobile: boolean;
    onLinkClick: () => void;
}) => {
    return (
        <FloatingElement editor={editor} style={{}}>
            <Toolbar variant="floating">
                <ToolbarGroup>
                    <UndoRedoButton action="undo" />
                    <UndoRedoButton action="redo" />
                </ToolbarGroup>

                <ToolbarSeparator />

                <ToolbarGroup>
                    <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
                    <ListDropdownMenu
                        portal={isMobile}
                        types={["bulletList", "orderedList", "taskList"]}
                    />
                    <BlockquoteButton />
                </ToolbarGroup>

                <ToolbarSeparator />

                <ToolbarGroup>
                    <MarkButton type="bold" />
                    <MarkButton type="italic" />
                    <MarkButton type="strike" />
                    <MarkButton type="code" />
                    <MarkButton type="underline" />

                    {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
                </ToolbarGroup>

                <ToolbarSeparator />

                <ToolbarGroup>
                    <MarkButton type="superscript" />
                    <MarkButton type="subscript" />
                </ToolbarGroup>

                <ToolbarSeparator />

                <ToolbarGroup>
                    <TextAlignButton align="left" />
                    <TextAlignButton align="center" />
                    <TextAlignButton align="right" />
                    <TextAlignButton align="justify" />
                </ToolbarGroup>
            </Toolbar>
        </FloatingElement>
    );
};
