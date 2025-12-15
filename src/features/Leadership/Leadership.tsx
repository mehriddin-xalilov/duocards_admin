import { useMemo, useState } from "react";

import { addToast, Button, Switch } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";
import { ImagePreview } from "@/components/ImagePreview";

import { ConfirmModal } from "@/components";
import { LeadershipModal, TabComponent } from "@/features/Leadership";
import { LeaderShipItemType, leadershipApi } from "@/services/api/leadership.api";

export const Leadership = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const search = useSearch({ from: "/_main/leadership" });
    const { lang } = search;
    const [leadershipDataModal, setLeadershiModal] = useState<{
        open: boolean;
        leadership?: LeaderShipItemType;
        lang_hash?: string;
    }>({ open: false });

    const queryClient = useQueryClient();

    const { mutate: deleteById } = useMutation({
        mutationFn: (id: number) => leadershipApi.deleteLeadership(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["leadership"] });
            addToast({
                title: "Rahbariyat muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const deleteLeadership = (id: number) => {
        deleteById(id);
    };

    const onHandleEdit = (item: LeaderShipItemType) => {
        setLeadershiModal({ open: true, leadership: item, lang_hash: item.lang_hash });
    };

    const handleDelete = (item: LeaderShipItemType) => {
        setIsConfirmModalOpen(true);
        setLeadershiModal({ open: false, leadership: item, lang_hash: item.lang_hash });
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!e.colDef.field) return;

        leadershipApi.updateLeadership(e.data.id, {
            [e.colDef.field]: e.newValue,
        });

        queryClient.invalidateQueries({ queryKey: ["leadership"] });
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
                field: "full_name",
                headerName: "F.I.O",
                flex: 1,
                editable: true,
            },
            {
                field: "position",
                headerName: "Lavozim",
                flex: 1,
                editable: true,
            },
            {
                field: "email",
                headerName: "Email",
                flex: 1,
                editable: true,
            },
            {
                field: "phone",
                headerName: "Telefon raqam",
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

                                leadershipApi
                                    .updateLeadership(params.data.id, {
                                        status: newStatus,
                                    })
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ["leadership"] });
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
                <TabComponent modal={false} />
                <Button
                    color="primary"
                    startContent={<Plus color="white" size={18} />}
                    onPress={() => setLeadershiModal({ open: true })}
                >
                    {"Yaratish"}
                </Button>
            </div>
            <div className="grow w-full p-5">
                <AgGridTable<LeaderShipItemType>
                    pagination
                    columnDefs={colDefs}
                    fetchData={leadershipApi.getLeaderships}
                    params={{
                        _l: lang ? lang : "uz",
                        include: "photo",
                        sort: "-id",
                    }}
                    queryKey="leadership"
                    rowHeight={60}
                    sideBar={false}
                    onCellValueChanged={onUpdate}
                />
            </div>
            <ConfirmModal
                description="Siz rahbariyatni o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="Rahbariyatni o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deleteLeadership(leadershipDataModal.leadership?.id ?? 0)}
            />

            <LeadershipModal
                leadershipDataModal={leadershipDataModal}
                setLeadershiModal={setLeadershiModal}
            />
        </div>
    );
};
