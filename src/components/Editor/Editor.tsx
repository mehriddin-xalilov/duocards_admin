import { useEffect, useRef, useState } from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

import { StarterKit } from "@tiptap/starter-kit";
import { Highlight } from "@tiptap/extension-highlight";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Placeholder, Selection } from "@tiptap/extensions";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { TableKit } from "@tiptap/extension-table";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Gapcursor } from "@tiptap/extensions";
import { debounce } from "lodash";

import { FontSize } from "@/components/Editor/extensions/FontSizeExtension";

import { Toolbar } from "@/components/Editor/UiPrimitive/Toolbar";

import { Image } from "@/components/Editor/Node/image-node/image-node-extension";
import { ImageUploadNode } from "@/components/Editor/Node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/Editor/Node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/Editor/Node/blockquote-node/blockquote-node.scss";
import "@/components/Editor/Node/code-block-node/code-block-node.scss";
import "@/components/Editor/Node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/Editor/Node/list-node/list-node.scss";
import "@/components/Editor/Node/image-node/image-node.scss";
import "@/components/Editor/Node/heading-node/heading-node.scss";
import "@/components/Editor/Node/paragraph-node/paragraph-node.scss";
import "@/components/Editor/Node/table-node/table-node.scss";

// --- Hooks ---
import { useIsMobile } from "@/components/Editor/hooks/use-mobile";
import { useWindowSize } from "@/components/Editor/hooks/use-window-size";
import { useCursorVisibility } from "@/components/Editor/hooks/use-cursor-visibility";

// --- Components ---
import { MainToolbarContent } from "@/components/Editor/components/MainToolbarContent";
import { MobileToolbarContent } from "@/components/Editor/components/MobileToolbarContent";
import { FloatingElementContent } from "@/components/Editor/components/FloatingElements/FloatingElementContent";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/components/Editor/lib/utils/tiptap-utils";

// --- Styles ---
import "./Editor.scss";

interface EditorProps {
    onChange?: (value: string) => void;
    isMenu?: boolean;
    menuContent?: React.ReactNode;
    editorContent?: React.ReactNode;
    defaultValue?: string;
    newWord?: string;
    watch?: (names?: string | string[]) => any;
}

export function Editor({
    onChange,
    isMenu,
    menuContent,
    defaultValue,
    editorContent,
    newWord,
    watch,
}: EditorProps) {
    const isMobile = useIsMobile();
    const { height } = useWindowSize();
    const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">("main");
    const toolbarRef = useRef<HTMLDivElement>(null);
    const [menu, setMenu] = useState(true);

    // const [charCounts, setCharCounts] = useState({
    //     title: 0,
    //     description: 0,
    //     content: 0,
    // });
    const debouncedOnChange = useRef(
        debounce((html: string) => {
            onChange?.(html);
        }, 500), // 500ms delay
    ).current;
    const editor = useEditor({
        immediatelyRender: false,
        content: defaultValue ?? "",
        shouldRerenderOnTransaction: false,
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                "aria-label": "Main content area, start typing to enter text.",
                class: "simple-editor",
            },
        },
        extensions: [
            StarterKit.configure({
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    enableClickSelection: true,
                },
            }),
            Placeholder.configure({
                placeholder: "Xabar matni", // placeholder text
                emptyEditorClass: "is-editor-empty font-bold", // optional: style uchun
            }),
            HorizontalRule,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            TextStyle,
            FontSize,
            Color.configure({ types: ["textStyle"] }),
            Image.configure({
                HTMLAttributes: { class: "custom-image-class" },
            }),
            Typography,
            Superscript,
            Subscript,
            Selection,
            Document,
            Paragraph,
            Text,
            Gapcursor,
            TableKit.configure({
                table: { resizable: true },
            }),
            ImageUploadNode.configure({
                accept: "image/*",
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: (file, onProgress, abortSignal) =>
                    handleImageUpload(
                        file,
                        {
                            uploadUrl: `${import.meta.env.VITE_API_BASE_URL}/files/upload`,
                            getUrl: (res) => res?.data[0]?.thumbnails?.normal?.src,
                        },
                        onProgress,
                        abortSignal,
                    ),
                onError: (error) => console.error("Upload failed:", error),
            }),
        ],
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();

            debouncedOnChange(html);
        },
    });

    const rect = useCursorVisibility({
        editor,
        overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
    });

    useEffect(() => {
        if (!isMobile && mobileView !== "main") {
            setMobileView("main");
        }
    }, [isMobile, mobileView]);

    useEffect(() => {
        if (!editor) return;
        editor
            .chain()
            .focus()
            .insertContent(newWord as string)
            .run();
    }, [newWord]);

    useEffect(() => {
        if (!watch) return;
        // @ts-ignore
        const subscription = watch((values: any) => {
            // setCharCounts({
            //     title: values?.title?.length || 0,
            //     description: values?.description?.length || 0,
            //     content: values?.content
            //         ? values?.content?.length
            //         : editor
            //           ? editor.getText().length
            //           : 0,
            // });
        });

        return () => subscription.unsubscribe?.();
    }, [watch, editor]);

    if (!editor) return null;

    return (
        <div
            className={`relative w-[100%] transition-all  duration-300 ease-in-out ${menu ? "pr-[400px]" : ""}`}
        >
            <EditorContext.Provider value={{ editor }}>
                <Toolbar
                    ref={toolbarRef}
                    style={{
                        ...(isMobile
                            ? {
                                  bottom: `calc(100% - ${height - rect.y}px)`,
                              }
                            : {}),
                    }}
                >
                    {mobileView === "main" ? (
                        <MainToolbarContent
                            isMenu={isMenu}
                            menu={menu}
                            setMenu={setMenu}
                            isMobile={isMobile}
                            // onHighlighterClick={() => setMobileView("highlighter")}
                            onLinkClick={() => setMobileView("link")}
                        />
                    ) : (
                        <MobileToolbarContent
                            type={mobileView === "highlighter" ? "highlighter" : "link"}
                            onBack={() => setMobileView("main")}
                        />
                    )}
                </Toolbar>
                <div className="simple-editor-content" style={{ padding: "3rem 3rem 2px" }}>
                    {editorContent}
                </div>
                <EditorContent
                    className="simple-editor-content min-h-screen pb-[100px]"
                    editor={editor}
                    placeholder="Awdawd"
                    role="presentation"
                />
                <FloatingElementContent
                    editor={editor}
                    isMobile={isMobile}
                    onLinkClick={() => setMobileView("link")}
                />
                <div
                    className={`p-5 rounded-r-[12px] overflow-hidden border-l-[1px]  border-l-gray-300 border-transparent  ] w-[400px] fixed  top-1/2 right-[12px] -translate-x-1/2 -translate-y-1/2  h-[97.4%] overflow-y-scroll  bg-white z-10 ] transform transition-all duration-300 ease-in-out ${menu ? "translate-x-0 opacity-[1]" : "translate-x-[150%] opacity-0"}`}
                >
                    {/* <div className="flex flex-col gap-0.5 mb-2">
                        <p className="text-gray-600">Belgilar soni:</p>

                        <div className="flex justify-between">
                            <div className="flex items-center gap-1">
                                <p>Sarlavha:</p>
                                <p>{charCounts.title} ta</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <p>Lid:</p>
                                <p>{charCounts.description} ta</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <p>Matn:</p>
                                <p>{charCounts.content} ta</p>
                            </div>
                        </div>
                    </div> */}
                    {menuContent}
                </div>
            </EditorContext.Provider>
        </div>
    );
}
