import { useMemo, useState } from "react";

import { addToast, Button, Switch } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";
import { ImagePreview } from "@/components/ImagePreview";

import { ConfirmModal } from "@/components";
import { BannerModal } from "@/features/Banner";
import { BannerItemType, bannerApi } from "@/services/api/banner.api";

export const Banner = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [bannerDataModal, setBannerModal] = useState<{
        open: boolean;
        banner?: BannerItemType;
    }>({ open: false });

    const queryClient = useQueryClient();

    const { mutate: deleteById } = useMutation({
        mutationFn: (id: number) => bannerApi.deleteBanner(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["banner"] });
            addToast({
                title: "Banner muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const deleteBanner = (id: number) => {
        deleteById(id);
    };

    const onHandleEdit = (item: BannerItemType) => {
        setBannerModal({ open: true, banner: item });
    };

    const handleDelete = (item: BannerItemType) => {
        setIsConfirmModalOpen(true);
        setBannerModal({ open: false, banner: item });
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!e.colDef.field) return;

        bannerApi.updateBanner(e.data.id, {
            [e.colDef.field]: e.newValue,
        });

        queryClient.invalidateQueries({ queryKey: ["banner"] });
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
                field: "title.uz",
                headerName: "Sarlavha",
                flex: 1,
            },
            // {
            //     field: "description.uz",
            //     headerName: "Tavsif",
            //     flex: 1,
            // },
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

                                bannerApi
                                    .updateBanner(params.data.id, {
                                        status: newStatus,
                                    })
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ["banner"] });
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
                    onPress={() => setBannerModal({ open: true })}
                >
                    {"Yaratish"}
                </Button>
            </div>
            <div className="grow w-full p-5">
                <AgGridTable<BannerItemType>
                    pagination
                    columnDefs={colDefs}
                    fetchData={bannerApi.getBanners}
                    params={{
                        include: "photo",
                        sort: "-id",
                    }}
                    queryKey="banner"
                    rowHeight={60}
                    sideBar={false}
                    onCellValueChanged={onUpdate}
                />
            </div>
            <ConfirmModal
                description="Siz bannerni o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="Bannerni o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deleteBanner(bannerDataModal.banner?.id ?? 0)}
            />

            <BannerModal bannerDataModal={bannerDataModal} setBannerModal={setBannerModal} />
        </div>
    );
};
