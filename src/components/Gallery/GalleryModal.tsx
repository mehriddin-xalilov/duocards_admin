import { useState } from "react";

import { Modal, ModalBody, ModalContent, ModalHeader, Tab, Tabs } from "@heroui/react";

import GalleryForm from "./GalleryForm";

export default function GalleryModal({
    isOpen,
    setIsOpen,
    editGallery,
    onSuccess,
    setEditGallery,
    fetchGalleries,
    setSelected,
}: any) {
    const [currLang, setCurrLang] = useState("uz");

    return (
        <Modal className=" h-[90vh]" isOpen={isOpen} size="5xl" onOpenChange={setIsOpen}>
            <ModalContent>
                <ModalHeader>Yangi fotogallereya qo‘shish</ModalHeader>

                <ModalBody className=" ">
                    <Tabs
                        className=" overflow-x-auto scrollbar-hide mb-5"
                        selectedKey={currLang}
                        onSelectionChange={(key) => {
                            setCurrLang(key as string);
                        }}
                    >
                        <Tab key="uz" title="O‘zbekcha" />
                        <Tab key="ru" title="Русский" />
                    </Tabs>
                    <GalleryForm
                        fetchGalleries={fetchGalleries}
                        currLang={currLang}
                        editGallery={editGallery}
                        setEditGallery={setEditGallery}
                        onSuccess={onSuccess}
                        setIsOpen={setIsOpen}
                        setSelected={setSelected}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
