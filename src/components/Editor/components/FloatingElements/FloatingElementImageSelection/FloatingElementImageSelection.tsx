// --- UI Primitives ---
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "@/components/Editor/UiPrimitive/Toolbar";

// --- Tiptap UI ---

// --- Lib ---
import { FloatingElement } from "@/components/Editor/lib/ui-utils/floating-element";
import { ImageAlignButton } from "@/components/Editor/Ui/image-align-button";
import { ImageDownloadButton } from "@/components/Editor/Ui/image-download-button";
import { DeleteNodeButton } from "@/components/Editor/Ui/delete-node-button";

export const FloatingElementImageSelection = ({
    editor,
    // isMobile,
    // onLinkClick,
}: {
    editor: any;
    // isMobile: boolean;
    // onLinkClick: () => void;
}) => {
    return (
        <FloatingElement editor={editor} style={{}}>
            <Toolbar variant="floating">
                <ToolbarGroup>
                    <ImageAlignButton align="left" />
                    <ImageAlignButton align="center" />
                    <ImageAlignButton align="right" />

                    <ToolbarSeparator />

                    <ImageDownloadButton />

                    <ToolbarSeparator />

                    <DeleteNodeButton />
                </ToolbarGroup>
            </Toolbar>
        </FloatingElement>
    );
};
