import { Dispatch, SetStateAction } from "react";

import { Upload } from "./upload";

import { UploadResponse } from "@/services/api/file.api";

export function UploadTab({
    setSelectedTab,
    isPhotoGallery,
    selectedTab,
    debouncedSearch,
    isOnly,
    setImages,
}: {
    setSelectedTab: any;
    selectedTab: string;
    isOnly?: any;
    isPhotoGallery?: boolean;
    debouncedSearch?: { title: string; description: string; author: string };
    setImages?: Dispatch<SetStateAction<UploadResponse[]>>;
}) {
    return (
        <div className="flex flex-col items-center gap-[20px]">
            <Upload
                debouncedSearch={debouncedSearch}
                isPhotoGallery={isPhotoGallery}
                multiple={true}
                selectedTab={selectedTab}
                setImages={setImages}
                isOnly={isOnly}
                setSelectedTab={setSelectedTab}
            />
            <div className="text-sm text-gray-600 space-y-1 text-center">
                {/* <p>
                    <strong>Ruxsat etilgan rasm turlari:</strong> jpg, jpeg, png, webp, gif
                </p> */}
                <p>
                    <strong>Maksimal rasm hajmi:</strong> 100 MB
                </p>
            </div>
        </div>
    );
}
