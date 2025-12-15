import { useMemo, useState } from "react";

import { addToast, Button, Switch } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";
import { ImagePreview } from "@/components/ImagePreview";

import { ConfirmModal } from "@/components";
import { LinksModal } from "@/features/Links";
import { LinksItemType, linksApi } from "@/services/api/links.api";

export const Links = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const search = useSearch({ from: "/_main/links" });
    const { lang } = search;
    const [linksDataModal, setLinksModal] = useState<{
        open: boolean;
        link?: LinksItemType;
        lang_hash?: string;
    }>({ open: false });

    const queryClient = useQueryClient();

    const { mutate: deleteById } = useMutation({
        mutationFn: (id: number) => linksApi.deleteLink(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["links"] });
            addToast({
                title: "Havola muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const deleteLink = (id: number) => {
        deleteById(id);
    };

    const onHandleEdit = (item: LinksItemType) => {
        setLinksModal({ open: true, link: item, lang_hash: item.lang_hash });
    };

    const handleDelete = (item: LinksItemType) => {
        setIsConfirmModalOpen(true);
        setLinksModal({ open: false, link: item, lang_hash: item.lang_hash });
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!e.colDef.field) return;

        linksApi.updateLink(e.data.id, {
            [e.colDef.field]: e.newValue,
        });

        queryClient.invalidateQueries({ queryKey: ["links"] });
    };

    const colDefs = useMemo<ColDef[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                width: 80,
                suppressMenu: true,
            },
            // {
            //     field: "name.oz",
            //     headerName: "Nomi (OZ)",
            //     flex: 1,
            //     valueGetter: (params) => params.data?.name?.oz ?? "",
            //     valueSetter: (params) => {
            //         params.data.name.oz = params.newValue;
            //         return true;
            //     },
            // },
            {
                field: "name.uz",
                headerName: "Nomi (UZ)",
                flex: 1,
                valueGetter: (params) => params.data?.name?.uz ?? "",
                valueSetter: (params) => {
                    params.data.name.uz = params.newValue;
                    return true;
                },
            },
            {
                field: "name.ru",
                headerName: "Nomi (RU)",
                flex: 1,
                valueGetter: (params) => params.data?.name?.ru ?? "",
                valueSetter: (params) => {
                    params.data.name.ru = params.newValue;
                    return true;
                },
            },
            // {
            //     field: "name.en",
            //     headerName: "Nomi (EN)",
            //     flex: 1,
            //     valueGetter: (params) => params.data?.name?.en ?? "",
            //     valueSetter: (params) => {
            //         params.data.name.en = params.newValue;
            //         return true;
            //     },
            // },
            {
                field: "logo",
                headerName: "Logo",
                width: 120,
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <ImagePreview
                            alt={params.data.name}
                            className="w-20 h-[55px] object-cover rounded-none"
                            src={params.data.logo?.thumbnails?.small?.src}
                        />
                    );
                },
            },

            {
                field: "status",
                headerComponent: () => (
                    <div className="!flex items-center justify-center w-full">Status</div>
                ),
                width: 100,
                editable: false,
                cellClass: "!flex justify-center items-center",
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <Switch
                            defaultSelected={!!params.value}
                            name={`status-${params.data.id}`}
                            size="sm"
                            onChange={(e) => {
                                const newStatus = e.target.checked ? 1 : 0;

                                linksApi
                                    .updateLink(params.data.id, {
                                        status: newStatus,
                                    })
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ["links"] });
                                    });
                            }}
                        />
                    );
                },
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
                <Button
                    color="primary"
                    startContent={<Plus color="white" size={18} />}
                    onPress={() => setLinksModal({ open: true })}
                >
                    {"Yaratish"}
                </Button>
            </div>
            <div className="grow w-full p-5">
                <AgGridTable<LinksItemType>
                    pagination
                    columnDefs={colDefs}
                    fetchData={linksApi.getLinks}
                    params={{
                        _l: lang ? lang : "uz",
                        include: "logo",
                    }}
                    queryKey="links"
                    rowHeight={60}
                    sideBar={false}
                    onCellValueChanged={onUpdate}
                />
            </div>
            <ConfirmModal
                description="Siz havolani o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="Havolani o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deleteLink(linksDataModal.link?.id ?? 0)}
            />

            <LinksModal linksDataModal={linksDataModal} setLinksModal={setLinksModal} />
        </div>
    );
};
