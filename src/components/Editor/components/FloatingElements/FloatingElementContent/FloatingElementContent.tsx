import { useEffect, useState } from "react";
import { FloatingElement } from "@/components/Editor/lib/ui-utils/floating-element";
import { FloatingElementTextSelection } from "../FloatingElementTextSelection";
import { FloatingElementImageSelection } from "../FloatingElementImageSelection";
import { FloatingElementTableSelection } from "../FloatingElementTableSelection";

export const FloatingElementContent = ({
    editor,
    isMobile,
    onLinkClick,
}: {
    editor: any;
    isMobile: boolean;
    onLinkClick: () => void;
}) => {
    const [isImageSelected, setIsImageSelected] = useState(false);
    const [isTextSlected, setIsTextSelected] = useState(false);

    useEffect(() => {
        if (!editor) return;

        const updateSelection = () => {
            const isImage = editor.isActive("image");
            const isTable = editor.isActive("table");
            const hasText = editor.state.selection?.from !== editor.state.selection?.to;

            setIsImageSelected(isImage);
            setIsTextSelected(hasText && !isImage && !isTable);
        };

        updateSelection();

        editor.on("selectionUpdate", updateSelection);

        return () => {
            editor.off("selectionUpdate", updateSelection);
        };
    }, [editor]);

    if (!editor) return null;

    return (
        <FloatingElement editor={editor} style={{}}>
            {isImageSelected && (
                <FloatingElementImageSelection
                    editor={editor}
                    // isMobile={isMobile}
                    // onLinkClick={onLinkClick}
                />
            )}

            {isTextSlected && (
                <FloatingElementTextSelection
                    editor={editor}
                    isMobile={isMobile}
                    onLinkClick={onLinkClick}
                />
            )}

            {/* {isTableActive && ( */}
            <FloatingElementTableSelection editor={editor} isMobile={isMobile} />
            {/* )} */}
        </FloatingElement>
    );
};
