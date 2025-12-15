import * as React from "react";
import type { Editor } from "@tiptap/react";
import { useTiptapEditor } from "@/components/Editor/hooks/use-tiptap-editor";

export interface UseFontSizeDropdownMenuConfig {
    editor?: Editor | null;
    sizes?: string[]; // ["12px", "14px", ...]
    hideWhenUnavailable?: boolean;
}

export function getActiveFontSize(editor: Editor | null): string | undefined {
    if (!editor || !editor.isEditable) return undefined;

    return editor.getAttributes("textStyle")?.fontSize;
}

export function useFontSizeDropdownMenu(config?: UseFontSizeDropdownMenuConfig) {
    const {
        editor: providedEditor,
        sizes = Array.from({ length: 33 }, (_, i) => `${i + 8}px`),
        hideWhenUnavailable = false,
    } = config || {};

    const { editor } = useTiptapEditor(providedEditor);
    const [isVisible, setIsVisible] = React.useState(true);

    const activeSize = getActiveFontSize(editor);

    React.useEffect(() => {
        if (!editor) return;

        const handleSelectionUpdate = () => {
            if (hideWhenUnavailable) {
                setIsVisible(editor.isEditable);
            }
        };

        handleSelectionUpdate();
        editor.on("selectionUpdate", handleSelectionUpdate);

        return () => {
            editor.off("selectionUpdate", handleSelectionUpdate);
        };
    }, [editor, hideWhenUnavailable]);

    return {
        isVisible,
        activeSize,
        sizes,
        editor,
        label: "Font Size",
    };
}
