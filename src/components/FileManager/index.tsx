import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Button, Input, Tab, Tabs } from "@heroui/react";

import { FileList } from "./fileList";
import { UploadTab } from "./uploadTab";

import { UploadResponse } from "@/services/api/file.api";

export default function FileManager({
    setOpenFileManager,
    setPreviews,
    multiple,
    full,
    isPhotoGallery,
    field,
    isOnly,
    isFile,
}: {
    setOpenFileManager?: Dispatch<SetStateAction<boolean>>;
    setPreviews?: Dispatch<SetStateAction<UploadResponse[]>>;
    multiple?: boolean;
    full?: boolean;
    isPhotoGallery?: boolean;
    isFile?: boolean;
    field?: any;
    isOnly?: ("img" | "video" | "file")[];
}) {
    const getDefaultTab = (isOnly?: ("img" | "video" | "file")[]) => {
        if (!isOnly || isOnly.length === 0) return "all";

        if (isOnly.includes("img")) return "all";
        if (isOnly.includes("video")) return "all-videos";
        if (isOnly.includes("file")) return "all-files";

        return "all";
    };
    const [selectedTab, setSelectedTab] = useState<string>(getDefaultTab(isOnly));
    const [images, setImages] = useState<any>([]);
    const [searchValues, setSearchValues] = useState({
        title: "",
        description: "",
        author: "",
    });
    const [debouncedSearch, setDebouncedSearch] = useState(searchValues);

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(searchValues), 500);

        return () => clearTimeout(timeout);
    }, [searchValues]);

    useEffect(() => {
        setSelectedTab(getDefaultTab(isOnly));
    }, [field]);

    return (
        <div className="flex flex-col w-full h-full">
            <h3>MEDIALAR</h3>
            <div className="flex items-center justify-between">
                <Tabs
                    className="overflow-x-auto scrollbar-hide mt-7"
                    selectedKey={selectedTab}
                    onSelectionChange={(val) => setSelectedTab(val as string)}
                >
                    <Tab key="upload" title="Yuklash" />
                    {(!isOnly || isOnly.includes("img")) && (
                        <Tab key="all" title="Barcha rasmlar" />
                    )}

                    {!isPhotoGallery && (!isOnly || isOnly.includes("file")) && (
                        <Tab key="all-files" title="Barcha fayllar" />
                    )}
                    {!isPhotoGallery && (!isOnly || isOnly.includes("video")) && (
                        <Tab key="all-videos" title="Barcha videolar" />
                    )}
                </Tabs>
                {images?.length > 0 && (
                    <Button
                        color="primary"
                        radius="sm"
                        type="button"
                        onPress={() => {
                            if (!images) return;

                            const merged = multiple ? [...(field.value ?? []), ...images] : images;

                            field?.onChange(merged);

                            setOpenFileManager?.(false);
                        }}
                    >
                        Birikitirish
                    </Button>
                )}
            </div>
            {selectedTab !== "upload" && (
                <div className="flex gap-3 mt-5">
                    <Input
                        label="Sarlavha"
                        radius="sm"
                        size="sm"
                        value={searchValues.title}
                        onChange={(e) =>
                            setSearchValues((prev) => ({ ...prev, title: e.target.value }))
                        }
                    />
                    <Input
                        label="Tavsif"
                        radius="sm"
                        size="sm"
                        value={searchValues.description}
                        onChange={(e) =>
                            setSearchValues((prev) => ({ ...prev, description: e.target.value }))
                        }
                    />
                    <Input
                        label="Muallif / Manba"
                        radius="sm"
                        size="sm"
                        value={searchValues.author}
                        onChange={(e) =>
                            setSearchValues((prev) => ({ ...prev, author: e.target.value }))
                        }
                    />
                </div>
            )}

            <div className="w-full flex grow items-center justify-center mt-[20px]  ">
                {selectedTab === "upload" && (
                    <UploadTab
                        debouncedSearch={debouncedSearch}
                        isPhotoGallery={isPhotoGallery}
                        selectedTab={selectedTab}
                        setImages={setImages}
                        isOnly={isOnly}
                        setSelectedTab={setSelectedTab}
                    />
                )}
                {selectedTab !== "upload" && (
                    <FileList
                        debouncedSearch={debouncedSearch}
                        field={field}
                        full={full}
                        images={images}
                        isFile={isFile}
                        isPhotoGallery={isPhotoGallery}
                        multiple={multiple}
                        selectedTab={selectedTab}
                        setImages={setImages}
                        setOpenFileManager={setOpenFileManager}
                        setPreviews={setPreviews}
                    />
                )}
            </div>
        </div>
    );
}
