// --- UI Primitives ---
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "@/components/Editor/UiPrimitive/Toolbar";

// --- Tiptap UI ---
import { UndoRedoButton } from "@/components/Editor/Ui/undo-redo-button";

// --- Lib ---
import { useEffect, useState } from "react";

export const FloatingElementTableSelection = ({ editor }: { editor: any; isMobile: boolean }) => {
    const [tableRect, setTableRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        if (!editor) return;

        const update = () => {
            const { state } = editor;
            const { from } = state.selection;

            let tableDom: HTMLElement | null = null;

            if (editor.isActive("table")) {
                const domAtPos = editor.view.domAtPos(from);

                let domNode: HTMLElement | null = null;

                if (domAtPos.node.nodeType === Node.ELEMENT_NODE) {
                    domNode = domAtPos.node as HTMLElement;
                } else if (domAtPos.node.nodeType === Node.TEXT_NODE) {
                    domNode = (domAtPos.node.parentElement as HTMLElement) ?? null;
                }

                if (domNode) {
                    tableDom = domNode.closest("table");
                }
            }

            if (tableDom) {
                const rect = tableDom.getBoundingClientRect();

                setTableRect(rect);
            } else {
                setTableRect(null);
            }
        };

        update();
        editor.on("selectionUpdate", update);
        editor.on("transaction", update);

        return () => {
            editor.off("selectionUpdate", update);
            editor.off("transaction", update);
        };
    }, [editor]);

    if (!tableRect) return null;

    return (
        <div
            style={{
                position: "absolute",
                top: tableRect.top + window.scrollY - 20, // 20px yuqoriga
                left: tableRect.left + window.scrollX,
                zIndex: 9999,
            }}
        >
            <Toolbar variant="floating">
                <ToolbarGroup>
                    <UndoRedoButton action="undo" />
                    <UndoRedoButton action="redo" />
                </ToolbarGroup>
                <ToolbarSeparator />
            </Toolbar>
        </div>
    );

    // return (
    //   <FloatingElement editor={editor} style={{}}>
    //     <Toolbar variant="floating">
    //       <ToolbarGroup>
    //         <UndoRedoButton action="undo" />
    //         <UndoRedoButton action="redo" />
    //       </ToolbarGroup>

    //       <ToolbarSeparator />
    //     </Toolbar>
    //   </FloatingElement>
    // );
};
