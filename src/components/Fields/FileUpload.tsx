import React, { useEffect, useState } from "react";

import { X, UploadCloud } from "lucide-react";
import { useController, Control } from "react-hook-form";

import FileManager from "../FileManager";
import { Modal } from "../Modal";

import { UploadResponse } from "@/services/api/file.api";

export type FileUploadProps = {
    name: string;
    control: Control<any>;
    label?: string;
    multiple?: boolean;
    accept?: string;
    defaultFiles?: UploadResponse[];
    errorMessage?: string;
    isInvalid?: boolean;
    full?: boolean;
    isPhotoGallery?: boolean;
    isPreview?: boolean;
    isOnly?: any;
    isFull?: boolean;
    isFile?: boolean;
};

export const FileUpload: React.FC<FileUploadProps> = ({
    name,
    control,
    label,
    multiple = false,
    defaultFiles = [],
    errorMessage,
    isInvalid,
    isPhotoGallery,
    isPreview = true,
    full = false,
    isFull = false,
    isOnly,
    isFile,
}) => {
    const { field } = useController({ name, control });
    const [previews, setPreviews] = useState<UploadResponse[]>(defaultFiles);
    const [openFileManager, setOpenFileManager] = useState(false);

    const handleRemove = (id: number) => {
        const filtered = previews.filter((file) => file.id !== id);

        setPreviews(filtered);
        field.onChange(multiple ? filtered.map((f) => f.id) : null);
    };

    useEffect(() => {
        if (field.value && previews?.length === 0) {
            setPreviews(defaultFiles);
        }
    }, [field.value]);
    const getLabelText = () => {
        if (!isOnly) return multiple ? "Rasmlar yoki fayllar yuklash" : "Rasm yoki fayl yuklash";

        const types = Array.isArray(isOnly) ? isOnly : [isOnly];

        const hasImage = types.includes("img");
        const hasVideo = types.includes("video");

        if (hasImage && hasVideo) {
            return multiple ? "Rasmlar yoki videolar yuklash" : "Rasm yoki video yuklash";
        }

        if (hasImage) {
            return multiple ? "Rasmlar yuklash" : "Rasm yuklash";
        }

        if (hasVideo) {
            return multiple ? "Videolar yuklash" : "Video yuklash";
        }

        return "Fayl yuklash";
    };
    const renderPreview = (file: UploadResponse) => {
        const isImage = file.ext.match(/(jpeg|jpg|png|gif|webp|svg)$/i);
        const isVideo = file.ext.match(/(mp4|mov|webm|mkv)$/i);

        if (isImage) {
            return (
                <img
                    alt={file.title}
                    className="w-full h-full object-contain"
                    src={file.thumbnails?.original?.src}
                />
            );
        }

        if (isVideo) {
            return (
                <video
                    controls
                    className="w-full h-full object-cover"
                    src={file.thumbnails?.original?.src || file.file}
                />
            );
        }

        return (
            <a
                href={file.thumbnails?.original?.src}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center w-full h-full text-sm text-blue-600 underline bg-gray-50"
            >
                <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                {file.title || file.file}
            </a>
        );
    };

    return (
        <div className={`flex flex-col gap-3 ${isFull && "w-full"}`}>
            {label && <label className="font-medium text-gray-700">{label}</label>}

            {!isPreview || previews.length === 0 ? (
                <button
                    className={`flex flex-col items-center justify-center px-6 py-14 border-2 border-dashed rounded-xl cursor-pointer transition text-center
                    ${isInvalid ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50"}`}
                    type="button"
                    onClick={() => {
                        setOpenFileManager(true);
                    }}
                >
                    <>
                        <UploadCloud className="w-10 h-10 mb-2 text-gray-400" />
                        <span className="text-sm text-gray-600">{getLabelText()}</span>
                    </>
                </button>
            ) : (
                <div
                    className={`grid h-full ${multiple ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1"} gap-4 `}
                >
                    {previews.map((file) => (
                        <div
                            key={file.id}
                            className="h-full relative group w-full aspect-video border rounded-xl overflow-hidden shadow bg-white"
                        >
                            {renderPreview(file)}

                            <button
                                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                type="button"
                                onClick={() => handleRemove(file.id)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {errorMessage && previews.length < 0 && (
                <span className="text-xs text-red-500">{errorMessage}</span>
            )}

            <Modal
                className="min-w-[90%] h-[90%] z-[1000]"
                isOpen={openFileManager}
                onClose={() => setOpenFileManager(false)}
            >
                {openFileManager && (
                    <FileManager
                        field={field}
                        full={full}
                        isOnly={isOnly}
                        isFile={isFile}
                        isPhotoGallery={isPhotoGallery}
                        multiple={multiple}
                        setOpenFileManager={setOpenFileManager}
                        setPreviews={setPreviews}
                    />
                )}
            </Modal>
        </div>
    );
};
