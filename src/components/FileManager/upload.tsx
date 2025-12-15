import React, { useState } from "react";

import { Spinner } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { UploadCloud } from "lucide-react";

import { fileApi, UploadResponse } from "@/services/api/file.api";

type UploadProps = {
    multiple?: boolean;
    isPhotoGallery?: boolean;
    accept?: string;
    onUpload?: (files: UploadResponse[]) => void;
    setSelectedTab?: (val: string) => void;
    selectedTab?: string;
    isOnly?: any;
    setImages?: (val: any) => void;
    debouncedSearch?: { title: string; description: string; author: string };
};

export const Upload: React.FC<UploadProps> = ({
    multiple = false,
    onUpload,
    setSelectedTab,
    isPhotoGallery,
    setImages,
    isOnly,
    accept = "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml,application/pdf,video/mp4,video/webm,video/ogg",
}) => {
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const queryClient = useQueryClient();
    const imageAccept =
        "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,video/ogg";
    const allAccept = isPhotoGallery ? imageAccept : accept;
    const allowedTypes = allAccept.split(",").map((t) => t.trim());

    const filterValidFiles = (files: File[]) => {
        return files.filter((file) => {
            const isValid = allowedTypes.includes(file.type);

            if (!isValid) {
                alert(`❌ Fayl turi qo‘llab-quvvatlanmaydi: ${file.name}`);
            }

            return isValid;
        });
    };
    const detectTabType = (file: UploadResponse, isOnly?: any) => {
        const ext = file.ext.toLowerCase();

        // 1) isOnly bo‘lsa, to‘g‘ridan-to‘g‘ri unga qaraymiz
        if (isOnly) {
            const types = Array.isArray(isOnly) ? isOnly : [isOnly];

            const onlyImg = types.includes("img");
            const onlyVideo = types.includes("video");
            const onlyFile = types.includes("file");

            if (onlyImg && !onlyVideo && !onlyFile) return "all";
            if (onlyVideo && !onlyImg && !onlyFile) return "all-videos";
            if (onlyFile && !onlyImg && !onlyVideo) return "all-files";

            if (types.includes("img") && types.includes("video")) {
                if (ext.match(/mp4|mov|webm|mkv/)) return "all-videos";
                return "all";
            }
        }

        if (ext.includes("pdf")) return "all-files";
        if (ext.match(/mp4|mov|webm|mkv/)) return "all-videos";
        if (ext.match(/jpg|jpeg|png|gif|webp|svg/)) return "all";

        return "all";
    };

    const uploadFiles = async (files: File[]) => {
        const validFiles = filterValidFiles(files);

        if (!validFiles.length) return;

        setLoading(true);
        try {
            const uploaded: UploadResponse[] = [];

            for (const file of validFiles) {
                const formData = new FormData();

                formData.append("files", file);
                const res = await fileApi.upload(formData);

                uploaded.push(...res.map((f) => ({ ...f, isNew: true })));
            }

            if (onUpload) onUpload(uploaded);
            if (isPhotoGallery && setImages) {
                setImages((prev: any) => [...prev, ...uploaded]);
            }
            const tabType = detectTabType(uploaded[0], isOnly);

            queryClient.setQueryData(["file-manager", tabType], (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    pages: old.pages.map((page: any, idx: number) =>
                        idx === 0 ? { ...page, data: [...uploaded, ...page.data] } : page,
                    ),
                };
            });
            if (setSelectedTab) {
                setSelectedTab(tabType);
            }
        } catch (err: any) {
            console.error("Upload error:", err);
        } finally {
            setLoading(false);
            setDragActive(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];

        uploadFiles(files);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const files = Array.from(e.dataTransfer.files);

        uploadFiles(files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    return (
        <div className="relative">
            <label
                className={`flex flex-col items-center justify-center w-[300px] h-[300px] border-2 border-dashed rounded-xl cursor-pointer transition text-center
                ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50"}`}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {loading ? (
                    <Spinner color="primary" size="lg" />
                ) : (
                    <>
                        <UploadCloud className="w-10 h-10 mb-2 text-gray-400" />
                        <span className="text-sm text-gray-600">Yuklang yoki tashlang</span>
                    </>
                )}

                <input
                    accept={allAccept}
                    className="hidden"
                    disabled={loading}
                    multiple={multiple}
                    type="file"
                    onChange={handleChange}
                />
            </label>
        </div>
    );
};
