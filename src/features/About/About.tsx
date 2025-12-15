import { useMemo, useState } from "react";

import { addToast, Button } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";
import { ImagePreview } from "@/components/ImagePreview";

import { ConfirmModal } from "@/components";
import { AboutModal, TabComponent } from "@/features/About";
import { AboutItemType, aboutApi } from "@/services/api/about.api";

export const About = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const search = useSearch({ from: "/_main/about" });
    const { lang } = search;
    const [dataLength, setDataLength] = useState(0);
    const [aboutModal, setAboutModal] = useState<{
        open: boolean;
        about?: AboutItemType;
        lang_hash?: string;
    }>({ open: false });

    const queryClient = useQueryClient();

    const { mutate: deleteById } = useMutation({
        mutationFn: (id: number) => aboutApi.deleteAbout(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["abouts"] });
            addToast({
                title: "Muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const deleteAbout = (id: number) => {
        deleteById(id);
    };

    const onHandleEdit = (item: AboutItemType) => {
        setAboutModal({ open: true, about: item, lang_hash: item.lang_hash });
    };

    const handleDelete = (item: AboutItemType) => {
        setIsConfirmModalOpen(true);
        setAboutModal({ open: false, about: item, lang_hash: item.lang_hash });
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!e.colDef.field) return;

        aboutApi.updateAbout(e.data.id, {
            [e.colDef.field]: e.newValue,
        });

        queryClient.invalidateQueries({ queryKey: ["abouts"] });
    };

    const colDefs = useMemo<ColDef[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                width: 80,
                suppressMenu: true,
            },
            {
                field: "photo",
                headerName: "Rasm",
                width: 120,
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <ImagePreview
                            alt={params.data.name}
                            className="w-20 h-[55px] object-cover rounded-none"
                            src={params.data.photo?.thumbnails?.small?.src}
                        />
                    );
                },
            },
            {
                field: "title",
                headerName: "Sarlavha",
                flex: 1,
                editable: true,
            },
            {
                field: "description",
                headerName: "Tavsif",
                flex: 1,
                editable: true,
            },
            {
                field: "founded_at",
                headerName: "Asos solingan yil",
                flex: 1,
                editable: true,
            },
            {
                field: "lessons_count",
                headerName: "Darslar soni",
                flex: 1,
                editable: true,
            },
            {
                field: "all_listeners_count",
                headerName: "Talabalar soni",
                flex: 1,
                editable: true,
            },
            {
                field: "finished_listeners_count",
                headerName: "Bitirgan talabalar soni",
                flex: 1,
                editable: true,
            },
            {
                field: "action",
                width: 100,

                headerComponent: () => (
                    <div className="!flex items-center justify-center w-full">Amallar</div>
                ),
                cellClass: "!flex items-center justify-center",
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <div className="flex gap-1">
                            <Button
                                isIconOnly
                                color="primary"
                                size="sm"
                                variant="light"
                                onPress={() => onHandleEdit(params.data)}
                            >
                                <Pencil size={16} />
                            </Button>
                            <Button
                                isIconOnly
                                color="danger"
                                size="sm"
                                variant="light"
                                onPress={() => handleDelete(params.data)}
                            >
                                <Trash size={16} />
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [],
    );

    return (
        <div className="w-full h-full flex flex-col p-3">
            <div className="flex items-center justify-between mt-3 px-[20px]">
                <TabComponent modal={false} />
                {Number(dataLength) === 0 && (
                    <Button
                        color="primary"
                        startContent={<Plus color="white" size={18} />}
                        onPress={() => setAboutModal({ open: true })}
                    >
                        {"Yaratish"}
                    </Button>
                )}
            </div>
            <div className="grow w-full p-5">
                <AgGridTable<AboutItemType>
                    pagination
                    columnDefs={colDefs}
                    fetchData={aboutApi.getAbouts}
                    params={{
                        _l: lang ? lang : "uz",
                        include: "photo",
                    }}
                    queryKey="abouts"
                    rowHeight={60}
                    sideBar={false}
                    onDataLoaded={(d) => setDataLength(d.length)}
                    onCellValueChanged={onUpdate}
                />
            </div>
            <ConfirmModal
                description="Siz rostdan ham o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="O'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deleteAbout(aboutModal.about?.id ?? 0)}
            />

            <AboutModal aboutModal={aboutModal} setAboutModal={setAboutModal} />
        </div>
    );
};
