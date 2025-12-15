import { useState } from "react";

import { Image, Modal, ModalContent, ModalBody } from "@heroui/react";

type ImagePreviewProps = {
    src: string; // Asl (katta) rasm linki
    thumb?: string; // Thumbnail (kichkina rasm), bo‘lmasa src ishlatiladi
    alt?: string;
    className?: string;
};

export const ImagePreview = ({ src, thumb, alt, className }: ImagePreviewProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Thumbnail image */}
            <Image
                alt={alt || "preview image"}
                className={`cursor-pointer object-cover  ${className || ""}`}
                src={thumb || src}
                onClick={() => setIsOpen(true)}
            />

            {/* Modal with full image */}
            <Modal
                className="bg-transparent shadow-none m-0 p-0 w-full rounded-none"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <ModalContent className="bg-transparent shadow-none m-0 p-0  w-full rounded-none">
                    <ModalBody className="bg-transparent shadow-none m-0 p-0  w-full rounded-none">
                        <Image
                            alt={alt || "full image"}
                            className="w-[1000px] rounded-none"
                            src={src}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
