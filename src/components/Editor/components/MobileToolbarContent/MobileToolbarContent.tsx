// --- UI Primitives ---
import { Button } from "@/components/Editor/UiPrimitive/Button";
import { ToolbarGroup, ToolbarSeparator } from "@/components/Editor/UiPrimitive/Toolbar";

// --- Tiptap Node ---
import "@/components/Editor/Node/blockquote-node/blockquote-node.scss";
import "@/components/Editor/Node/code-block-node/code-block-node.scss";
import "@/components/Editor/Node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/Editor/Node/list-node/list-node.scss";
import "@/components/Editor/Node/image-node/image-node.scss";
import "@/components/Editor/Node/heading-node/heading-node.scss";
import "@/components/Editor/Node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---

// --- Icons ---
import { ArrowLeftIcon } from "@/components/Editor/Icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/Editor/Icons/highlighter-icon";
import { LinkIcon } from "@/components/Editor/Icons/link-icon";
import { ColorHighlightPopoverContent } from "@/components/Editor/Ui/color-highlight-popover";
import { LinkContent } from "@/components/Editor/Ui/link-popover";

export const MobileToolbarContent = ({
    type,
    onBack,
}: {
    type: "highlighter" | "link";
    onBack: () => void;
}) => (
    <>
        <ToolbarGroup>
            <Button data-style="ghost" onClick={onBack}>
                <ArrowLeftIcon className="tiptap-button-icon" />
                {type === "highlighter" ? (
                    <HighlighterIcon className="tiptap-button-icon" />
                ) : (
                    <LinkIcon className="tiptap-button-icon" />
                )}
            </Button>
        </ToolbarGroup>

        <ToolbarSeparator />

        {type === "highlighter" ? <ColorHighlightPopoverContent /> : <LinkContent />}
    </>
);
