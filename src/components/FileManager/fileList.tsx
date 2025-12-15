import { Dispatch, SetStateAction, useState } from "react";

import { Button } from "@heroui/button";
import { useInfiniteScroll } from "@heroui/use-infinite-scroll";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Form, FormFields } from "../Form";

import { fileApi, UploadResponse } from "@/services/api/file.api";
import FileType from "./fileType";
import ImgType from "./ImgType";
import VideoType from "./videoType";
import { Tab, Tabs } from "@heroui/react";

export function FileList({
    selectedTab,
    setPreviews,
    setOpenFileManager,
    multiple,
    full,
    isPhotoGallery,
    field,
    setImages,
    isFile,
    images,
}: {
    selectedTab: string;
    setPreviews?: Dispatch<SetStateAction<UploadResponse[]>>;
    setOpenFileManager?: Dispatch<SetStateAction<boolean>>;
    multiple?: boolean;
    full?: boolean;
    images?: any;
    debouncedSearch?: { title: string; description: string; author: string };
    field?: any;
    isPhotoGallery?: boolean;
    isFile?: boolean;
    setImages?: Dispatch<SetStateAction<UploadResponse[]>>;
}) {
    const [itemClicked, setItemClicked] = useState(false);
    const [image, setImage] = useState<any>(null);
    const [lang, setLang] = useState("uz");
    const queryClient = useQueryClient();
    const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ["file-manager", selectedTab],
        queryFn: async ({ pageParam = 1 }) => {
            if (selectedTab === "all-files") {
                return fileApi.getFileManager({
                    page: pageParam,
                    per_page: 20,
                    sort: "-id",
                    ext: "pdf,doc,docx,xls,xlsx,ppt,pptx,txt,xml,csv,json",
                });
            }
            if (selectedTab === "all-videos") {
                return fileApi.getFileManager({
                    page: pageParam,
                    per_page: 20,
                    sort: "-id",
                    ext: "mp4,mov,avi,mkv,webm,wmv,flv,mpeg,3gp",
                });
            } else {
                return fileApi.getFileManager({
                    page: pageParam,
                    per_page: 20,
                    sort: "-id",
                    ext: "svg,jpg,jpeg,png,avif,webp,gif,bmp,tiff,ico,heic,heif",
                });
            }
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage?.meta?.next ?? undefined;
        },
        enabled: Boolean(selectedTab),
    });

    const [loaderRef, scrollRef] = useInfiniteScroll({
        hasMore: !!hasNextPage,
        onLoadMore: async () => {
            if (hasNextPage) {
                await fetchNextPage();
            }
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => fileApi.deleteFile(id),
        onMutate: async (id: number) => {
            setItemClicked(false);
            await queryClient.cancelQueries({
                queryKey: ["file-manager", selectedTab],
            });
            const prevData = queryClient.getQueryData(["file-manager", selectedTab]);

            queryClient.setQueryData(["file-manager", selectedTab], (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        data: page.data.filter((f: any) => f.id !== id),
                    })),
                };
            });

            return { prevData };
        },
        onError: (_err, _id, context) => {
            if (context?.prevData) {
                queryClient.setQueryData(["file-manager", selectedTab], context.prevData);
            }
        },
    });

    const files = data?.pages.flatMap((page) => page.data);
    const docs = files?.filter((item: any) => item?.ext?.includes("pdf"));
    const videos = files?.filter((item: any) => item?.ext?.includes("mp4"));
    const allImages = files?.filter(
        (item: any) => !item?.ext?.includes("pdf") && !item?.ext?.includes("mp4"),
    );

    return (
        <div className="flex gap-5 w-full">
            <div
                ref={scrollRef as React.RefObject<HTMLDivElement>}
                className={`grid   grid-cols-6 gap-10 ${itemClicked ? "w-[80%]" : "w-[100%]"} h-[64vh] overflow-y-scroll transition-all duration-300`}
            >
                {selectedTab === "all" && (
                    <>
                        {allImages?.map((file: any) => {
                            return (
                                <ImgType
                                    file={file}
                                    setImage={setImage}
                                    setImages={setImages}
                                    images={images}
                                    setItemClicked={setItemClicked}
                                    isPhotoGallery={isPhotoGallery}
                                    onConfirm={() => deleteMutation.mutate(file?.id)}
                                />
                            );
                        })}
                    </>
                )}
                {selectedTab === "all-files" && (
                    <>
                        {docs?.map((file: any) => {
                            return (
                                <FileType
                                    file={file}
                                    isPhotoGallery={isFile}
                                    onConfirm={() => deleteMutation.mutate(file?.id)}
                                    images={images}
                                    setImage={setImage}
                                    setImages={setImages}
                                    setItemClicked={setItemClicked}
                                />
                            );
                        })}
                    </>
                )}

                {selectedTab === "all-videos" && (
                    <>
                        {videos?.map((file: any) => {
                            return (
                                <VideoType
                                    file={file}
                                    setImage={setImage}
                                    setImages={setImages}
                                    images={images}
                                    setItemClicked={setItemClicked}
                                    isPhotoGallery={isPhotoGallery}
                                    onConfirm={() => deleteMutation.mutate(file?.id)}
                                />
                            );
                        })}
                    </>
                )}

                <div
                    ref={loaderRef as React.RefObject<HTMLDivElement>}
                    className="col-span-4 flex justify-center py-4 w-full"
                />
            </div>
            <div
                className={`${itemClicked ? "w-[20%] opacity-[1]" : "w-0 overflow-hidden opacity-0"}   transition-all duration-300 border-1 border-gray-200 rounded-sm flex flex-col items-start justify-start`}
            >
                {/* <div className="p-4 ml-auto">
                    <Button isIconOnly onClick={() => setItemClicked(false)}>
                        <XIcon />
                    </Button>
                </div> */}

                <Form
                    key={image?.title}
                    className="w-full"
                    fetchFunction={(values) => {
                        const payload = {
                            name: {
                                uz: values.name_uz,
                                ru: values.name_ru,
                            },
                        };

                        return fileApi.updateFile(image?.id, payload);
                    }}
                    fields={[
                        {
                            name: "name_uz",
                            validationType: "string",
                            defaultValue: image?.name?.uz ?? "",
                            isRequired: true,
                            errorMessage: "Iltimos nom kiriting",
                        },
                        // {
                        //     name: "name_oz",
                        //     validationType: "string",
                        //     defaultValue: image?.name?.oz ?? "",
                        //     isRequired: true,
                        //     errorMessage: "Iltimos nom kiriting",
                        // },
                        {
                            name: "name_ru",
                            validationType: "string",
                            defaultValue: image?.name?.ru ?? "",
                            errorMessage: "Iltimos nom kiriting",
                        },
                        // {
                        //     name: "name_en",
                        //     validationType: "string",
                        //     defaultValue: image?.name?.en ?? "",
                        //     isRequired: true,
                        //     errorMessage: "Iltimos nom kiriting",
                        // },
                    ]}
                    onSuccess={async (res) => {
                        const updatedFile = res.data;

                        queryClient.setQueryData(["file-manager", selectedTab], (old: any) => {
                            if (!old) return old;

                            return {
                                ...old,
                                pages: old.pages.map((page: any) => ({
                                    ...page,
                                    data: page.data.map((f: any) =>
                                        f.id === updatedFile.id ? { ...f, ...updatedFile } : f,
                                    ),
                                })),
                            };
                        });
                    }}
                >
                    {({ isLoading, setValue, ...formRestProps }) => {
                        return (
                            <>
                                {image && (
                                    <>
                                        {image && (
                                            <>
                                                {image.ext !== "mp4" && image.ext !== "pdf" ? (
                                                    <img
                                                        alt={image.title}
                                                        className="w-full bg-gray-100 h-[200px] object-contain"
                                                        src={image.thumbnails.normal.src}
                                                    />
                                                ) : image.ext === "mp4" ? (
                                                    <video
                                                        src={
                                                            image.url || image.thumbnails.normal.src
                                                        }
                                                        className="w-full h-[200px] object-contain"
                                                        controls
                                                    />
                                                ) : (
                                                    <div className="w-full h-[200px] flex items-center justify-center bg-gray-100 text-gray-700 text-sm font-medium">
                                                        {image.title || "Fayl"}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        <Tabs
                                            className=" overflow-x-auto scrollbar-hide  mt-3 ml-3"
                                            selectedKey={lang}
                                            onSelectionChange={(val) => setLang(String(val))}
                                        >
                                            <Tab key="uz" title="O‘zbekcha" />
                                            <Tab key="ru" title="Русский" />
                                        </Tabs>
                                        <div className="flex flex-col gap-2  p-4 w-full">
                                            {lang === "uz" && (
                                                <FormFields.Textarea
                                                    label="Nomi"
                                                    name="name_uz"
                                                    placeholder="Nomi"
                                                    radius="sm"
                                                    setValue={setValue}
                                                    size="sm"
                                                    type="text"
                                                    {...formRestProps}
                                                />
                                            )}
                                            {lang === "ru" && (
                                                <FormFields.Textarea
                                                    label="Nomi"
                                                    name="name_ru"
                                                    placeholder="Nomi"
                                                    radius="sm"
                                                    setValue={setValue}
                                                    size="sm"
                                                    type="text"
                                                    {...formRestProps}
                                                />
                                            )}
                                        </div>
                                    </>
                                )}
                                <div className="p-4 flex items-center justify-between">
                                    <Button
                                        color="primary"
                                        isDisabled={!formRestProps.formState?.isDirty || isLoading}
                                        isLoading={isLoading}
                                        radius="sm"
                                        type="submit"
                                    >
                                        Saqlash
                                    </Button>
                                    {setOpenFileManager && setPreviews && field && (
                                        <Button
                                            color="primary"
                                            radius="sm"
                                            type="button"
                                            onPress={() => {
                                                if (setPreviews && image) {
                                                    setPreviews((prev) => {
                                                        const safePrev = Array.isArray(prev)
                                                            ? prev
                                                            : [];
                                                        const updated = multiple
                                                            ? [...safePrev, image]
                                                            : [image];

                                                        if (full) {
                                                            field?.onChange(updated);
                                                        } else {
                                                            field?.onChange(
                                                                multiple
                                                                    ? updated.map((f) => f.id)
                                                                    : updated[0].id,
                                                            );
                                                        }

                                                        return updated;
                                                    });
                                                }
                                                setOpenFileManager?.(false);
                                            }}
                                        >
                                            Biriktirish
                                        </Button>
                                    )}
                                </div>
                            </>
                        );
                    }}
                </Form>
            </div>
        </div>
    );
}
