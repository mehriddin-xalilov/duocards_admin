import { useMemo, useState } from "react";

import { addToast, Button, Switch } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";

import { ConfirmModal } from "@/components";
import { EventModal, TabComponent } from "@/features/Event";
import { EventItemType, eventApi } from "@/services/api/event.api";

export const Event = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const search = useSearch({ from: "/_main/event" });
    const { lang } = search;
    const [eventDataModal, setEventModal] = useState<{
        open: boolean;
        event?: EventItemType;
        lang_hash?: string;
    }>({ open: false });

    const queryClient = useQueryClient();

    const { mutate: deleteById } = useMutation({
        mutationFn: (id: number) => eventApi.deleteEvent(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["event"] });
            addToast({
                title: "Tadbir muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const deleteEvent = (id: number) => {
        deleteById(id);
    };

    const onHandleEdit = (item: EventItemType) => {
        setEventModal({ open: true, event: item, lang_hash: item.lang_hash });
    };

    const handleDelete = (item: EventItemType) => {
        setIsConfirmModalOpen(true);
        setEventModal({ open: false, event: item, lang_hash: item.lang_hash });
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!e.colDef.field) return;

        eventApi.updateEvent(e.data.id, {
            [e.colDef.field]: e.newValue,
        });

        queryClient.invalidateQueries({ queryKey: ["event"] });
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
                field: "location",
                headerName: "Manzil",
                flex: 1,
                editable: true,
            },
            {
                field: "start_time",
                headerName: "Boshlnish vaqti",
                flex: 1,
            },
            {
                field: "end_time",
                headerName: "Tugash vaqti",
                flex: 1,
            },
            {
                field: "date",
                headerName: "Sanasi",
                flex: 1,
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

                                eventApi
                                    .updateEvent(params.data.id, {
                                        status: newStatus,
                                    })
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ["event"] });
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
                    onPress={() => setEventModal({ open: true })}
                >
                    {"Yaratish"}
                </Button>
            </div>
            <div className="grow w-full p-5">
                <AgGridTable<EventItemType>
                    pagination
                    columnDefs={colDefs}
                    fetchData={eventApi.getEvents}
                    params={{
                        _l: lang ? lang : "uz",
                    }}
                    queryKey="event"
                    rowHeight={60}
                    sideBar={false}
                    onCellValueChanged={onUpdate}
                />
            </div>
            <ConfirmModal
                description="Siz tadbirdni o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="Tadbirni o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deleteEvent(eventDataModal.event?.id ?? 0)}
            />

            <EventModal eventDataModal={eventDataModal} setEventModal={setEventModal} />
        </div>
    );
};
