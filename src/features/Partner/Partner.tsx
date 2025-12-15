import { useMemo, useState } from "react";

import { addToast, Button, Switch } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";
import { ImagePreview } from "@/components/ImagePreview";

import { ConfirmModal } from "@/components";
import { PartnerModal } from "@/features/Partner";
import { PartnerItemType, partnerApi } from "@/services/api/partner.api";

export const Partner = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [partnerDataModal, setPartnerModal] = useState<{
        open: boolean;
        partner?: PartnerItemType;
    }>({ open: false });

    const queryClient = useQueryClient();

    const { mutate: deleteById } = useMutation({
        mutationFn: (id: number) => partnerApi.deletePartner(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["partners"] });
            addToast({
                title: "Hamkor muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const deletePartner = (id: number) => {
        deleteById(id);
    };

    const onHandleEdit = (item: PartnerItemType) => {
        setPartnerModal({ open: true, partner: item });
    };

    const handleDelete = (item: PartnerItemType) => {
        setIsConfirmModalOpen(true);
        setPartnerModal({ open: false, partner: item });
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!e.colDef.field) return;

        partnerApi.updatePartner(e.data.id, {
            [e.colDef.field]: e.newValue,
        });

        queryClient.invalidateQueries({ queryKey: ["partners"] });
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
                field: "link",
                headerName: "Link",
                flex: 1,
                editable: true,
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

                                partnerApi
                                    .updatePartner(params.data.id, {
                                        status: newStatus,
                                    })
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ["partners"] });
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
                    onPress={() => setPartnerModal({ open: true })}
                >
                    {"Yaratish"}
                </Button>
            </div>
            <div className="grow w-full p-5">
                <AgGridTable<PartnerItemType>
                    pagination
                    columnDefs={colDefs}
                    fetchData={partnerApi.getPartners}
                    params={{
                        include: "logo",
                    }}
                    queryKey="partners"
                    rowHeight={60}
                    sideBar={false}
                    onCellValueChanged={onUpdate}
                />
            </div>
            <ConfirmModal
                description="Siz hamkorni o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="Hamkorni o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deletePartner(partnerDataModal.partner?.id ?? 0)}
            />

            <PartnerModal partnerDataModal={partnerDataModal} setPartnerModal={setPartnerModal} />
        </div>
    );
};
