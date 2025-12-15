// --- UI Primitives ---
import { BlockquoteButton } from "@/components/Editor/Ui/blockquote-button";

// --- Tiptap UI ---
import { CodeBlockButton } from "@/components/Editor/Ui/code-block-button";

import { HeadingDropdownMenu } from "@/components/Editor/Ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/Editor/Ui/image-upload-button";
import { LinkPopover, LinkButton } from "@/components/Editor/Ui/link-popover";
import { ListDropdownMenu } from "@/components/Editor/Ui/list-dropdown-menu";
import { MarkButton } from "@/components/Editor/Ui/mark-button";
import { TextAlignButton } from "@/components/Editor/Ui/text-align-button";
import { UndoRedoButton } from "@/components/Editor/Ui/undo-redo-button";
import { Spacer } from "@/components/Editor/UiPrimitive/Spacer";
import { ToolbarGroup, ToolbarSeparator } from "@/components/Editor/UiPrimitive/Toolbar";
import { ColorTextPopover } from "@/components/Editor/Ui/color-text-popover";
import { TableCreateMenu } from "@/components/Editor/Ui/table-create-menu";
import { TableOfContents } from "lucide-react";

// --- Components ---

export const MainToolbarContent = ({
    // onHighlighterClick,
    onLinkClick,
    setMenu,
    isMobile,
    menu,
    isMenu,
}: {
    // onHighlighterClick: () => void;
    onLinkClick: () => void;
    setMenu: (value: boolean) => void;
    isMobile?: boolean;
    menu?: boolean;
    isMenu?: boolean;
}) => {
    return (
        <>
            <Spacer />

            <ToolbarGroup>
                <UndoRedoButton action="undo" />
                <UndoRedoButton action="redo" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />

                {/* <FontSizeDropdownMenu portal={isMobile} /> */}

                <ListDropdownMenu
                    portal={isMobile}
                    types={["bulletList", "orderedList", "taskList"]}
                />

                <BlockquoteButton />

                <CodeBlockButton />

                <TableCreateMenu />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type="bold" />
                <MarkButton type="italic" />
                <MarkButton type="strike" />
                <MarkButton type="code" />
                <MarkButton type="underline" />

                <ColorTextPopover />
                {/* {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )} */}
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

            <ToolbarSeparator />

            <ToolbarGroup>
                <ImageUploadButton text="" />
            </ToolbarGroup>

            <Spacer />

            {isMobile && <ToolbarSeparator />}
            {isMenu && setMenu && (
                <ToolbarGroup className=" cursor-pointer mr-5" onClick={() => setMenu(!menu)}>
                    <TableOfContents />
                </ToolbarGroup>
            )}
            {/* <ToolbarGroup>
                <ThemeToggle />
            </ToolbarGroup> */}
        </>
    );
};
