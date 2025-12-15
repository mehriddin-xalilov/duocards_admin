import type { Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/components/Editor/hooks/use-tiptap-editor";

// --- Lib ---
import { isNodeTypeSelected } from "@/components/Editor/lib/utils/tiptap-utils";

// --- Tiptap UI ---
import { DeleteNodeButton } from "@/components/Editor/Ui/delete-node-button";
import { ImageDownloadButton } from "@/components/Editor/Ui/image-download-button";
import { ImageAlignButton } from "@/components/Editor/Ui/image-align-button";

// --- UI Primitive ---
import { Separator } from "@/components/Editor/UiPrimitive/Separator";

export function ImageNodeFloating({ editor: providedEditor }: { editor?: Editor | null }) {
    const { editor } = useTiptapEditor(providedEditor);
    const visible = isNodeTypeSelected(editor, ["image"]);

    if (!editor || !visible) {
        return null;
    }

    return (
        <>
            <ImageAlignButton align="left" />
            <ImageAlignButton align="center" />
            <ImageAlignButton align="right" />
            <Separator />
            <ImageDownloadButton />
            <Separator />
            <DeleteNodeButton />
        </>
    );
}
