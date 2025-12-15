import { useMemo, useState } from "react";

import { addToast, Button, Image, Switch } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";

import { ConfirmModal } from "@/components";
import { SettingsModal, TabComponent } from "@/features/Settings";
import { SettingItemType, SettingsApi } from "@/services/api/settings.api";

export const Settings = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const search = useSearch({ from: "/_main/settings" });
    const { lang } = search;

    const [settingsModalData, setSettingsModal] = useState<{
        open: boolean;
        settings?: SettingItemType;
        lang_hash?: string;
    }>({ open: false });

    const queryClient = useQueryClient();

    const { mutate: deleteById } = useMutation({
        mutationFn: (id: number) => SettingsApi.deleteSetting(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            addToast({
                title: "Sozlama muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const deleteSetting = (id: number) => {
        deleteById(id);
    };

    const onHandleEdit = (item: SettingItemType) => {
        setSettingsModal({ open: true, settings: item, lang_hash: item.lang_hash });
    };

    const handleDelete = (item: SettingItemType) => {
        setIsConfirmModalOpen(true);
        setSettingsModal({ open: false, settings: item, lang_hash: item.lang_hash });
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!e.colDef.field) return;

        SettingsApi.updateSetting(e.data.id, {
            [e.colDef.field]: e.newValue,
        });

        queryClient.invalidateQueries({ queryKey: ["settings"] });
    };

    const colDefs = useMemo<ColDef[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                width: 100,
                suppressMenu: true,
                cellClass: "!flex items-center",
            },
            {
                field: "photo",
                headerName: "Rasm",
                width: 120,
                cellClass: "!flex items-center",
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <Image
                            alt={params.data.name}
                            className="w-[55px] h-[55px] object-cover rounded-sm"
                            src={params.data.photo?.thumbnails?.small?.src}
                        />
                    );
                },
            },
            {
                field: "name",
                headerName: "Nom",
                flex: 1,
                editable: true,
                cellClass: "!flex items-center",
            },
            {
                field: "btn_text",
                headerName: "Tugma matni",
                flex: 1,
                editable: true,
                cellClass: "!flex items-center",
            },
            {
                field: "link",
                headerName: "Link",
                flex: 1,
                editable: true,
                cellClass: "!flex items-center",
            },
            {
                field: "alias",
                headerName: "Alias",
                width: 150,
                editable: true,
                cellClass: "!flex items-center",
            },
            {
                field: "sort",
                headerName: "Tartib raqami",
                editable: true,
                cellClass: "!flex items-center justify-center",
                width: 150,
            },
            {
                field: "status",
                headerComponent: () => (
                    <div className="!flex items-center justify-center w-full">Status</div>
                ),
                width: 80,
                editable: false,
                cellClass: "!flex items-center justify-center",
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <Switch
                            defaultSelected={!!params.value}
                            name={`status-${params.data.id}`}
                            size="sm"
                            onChange={(e) => {
                                const newStatus = e.target.checked ? 1 : 0;

                                SettingsApi.updateSetting(params.data.id, {
                                    status: newStatus,
                                }).then(() => {
                                    queryClient.invalidateQueries({ queryKey: ["settings"] });
                                });
                            }}
                        />
                    );
                },
            },
            {
                field: "action",
                headerComponent: () => (
                    <div className="!flex items-center justify-center w-full">Amallar</div>
                ),
                width: 100,
                cellClass: "!flex items-center justify-center",
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <div className="flex gap-1">
                            <Button
                                isIconOnly
                                color="primary"
                                size="md"
                                variant="light"
                                onPress={() => onHandleEdit(params.data)}
                            >
                                <Pencil size={20} />
                            </Button>
                            <Button
                                isIconOnly
                                color="danger"
                                size="md"
                                variant="light"
                                onPress={() => handleDelete(params.data)}
                            >
                                <Trash size={20} />
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
                    onPress={() => setSettingsModal({ open: true })}
                >
                    {"Yaratish"}
                </Button>
            </div>

            <div className="grow w-full p-5">
                <AgGridTable<SettingItemType>
                    pagination
                    columnDefs={colDefs}
                    fetchData={SettingsApi.getSettings}
                    params={{
                        _l: lang ? lang : "uz",
                        include: "photo",
                    }}
                    queryKey="settings"
                    rowHeight={60}
                    sideBar={false}
                    onCellValueChanged={onUpdate}
                />
            </div>
            <ConfirmModal
                description="Siz sozlamani o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="sozlamani o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deleteSetting(settingsModalData.settings?.id ?? 0)}
            />

            <SettingsModal
                setSettingsModal={setSettingsModal}
                settingsModalData={settingsModalData}
            />
        </div>
    );
};
