import { Button } from "@heroui/button";
import { Popconfirm } from "../Modal/Popconfirm";
import { Trash } from "lucide-react";

const FileType = ({
    file,
    isPhotoGallery,
    onConfirm,
    images,
    setItemClicked,
    setImage,
    setImages,
}: {
    file: {
        id: number;
        thumbnails: {
            normal: {
                src: string;
            };
        };
        title: string;
        isNew: boolean;
        name: {
            uz: string;
        };
    };
    onConfirm: any;
    images: [];
    isPhotoGallery: any;
    setItemClicked: any;
    setImage: any;
    setImages: any;
}) => {
    return (
        <div
            key={file?.id}
            className={`${isPhotoGallery && images.find((f: { id: number }) => f?.id === file?.id) ? "!border-blue-500 " : "border-transparent"} border-3 border-transparent group w-full h-40 bg-gray-100 rounded-sm cursor-pointer relative `}
            onClick={() => {
                if (!isPhotoGallery) {
                    setImage(file);
                    setItemClicked(true);
                } else {
                    if (setImages) {
                        setImages((prev: any) => {
                            const exists = prev?.find((f: any) => f?.id === file?.id);

                            if (exists) {
                                return prev?.filter((f: any) => f?.id !== file?.id);
                            } else {
                                return [...prev, file];
                            }
                        });
                    }
                }
            }}
        >
            <img
                alt="pdf-icon"
                className="w-[90%] h-[90%] object-contain mt-2"
                src="/assets/images/pdf-icon.png"
            />
            {file?.isNew && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    YANGI
                </span>
            )}
            {!isPhotoGallery && (
                <Popconfirm
                    cancelText="Bekor qilish"
                    description={"Rostdan ham rasmni o'chirmoqchimisiz?"}
                    okText="Ha"
                    title={"Rasmni o'chirish"}
                    onConfirm={onConfirm}
                >
                    <Button
                        isIconOnly
                        className="group-hover:opacity-100 opacity-0 bg-[#f8c7c7] absolute top-2 right-2 rounded-full"
                        size="sm"
                        variant="flat"
                    >
                        <Trash size={18} stroke="#f74a4a" />
                    </Button>
                </Popconfirm>
            )}

            <h3 className="line-clamp-1 mt-2">{file?.name?.uz}</h3>
        </div>
    );
};

export default FileType;
