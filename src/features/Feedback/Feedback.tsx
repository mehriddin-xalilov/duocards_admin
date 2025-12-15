import { useMemo, useState } from "react";

import { addToast, Button, Switch } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";

import { ConfirmModal } from "@/components";
import { FeedbackModal, TabComponent } from "@/features/Feedback";
import { FeedbackItemType, FeedbackApi } from "@/services/api/feedback.api";

export const Feedback = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const search = useSearch({ from: "/_main/feedbacks" });
    const { lang } = search;
    const [feedbackDataModal, setFeedbackModal] = useState<{
        open: boolean;
        feedback?: FeedbackItemType;
        lang_hash?: string;
    }>({ open: false });

    const queryClient = useQueryClient();

    const { mutate: deleteById } = useMutation({
        mutationFn: (id: number) => FeedbackApi.deleteFeedback(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
            addToast({
                title: "Sharh muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const deleteFeedback = (id: number) => {
        deleteById(id);
    };

    const onHandleEdit = (item: FeedbackItemType) => {
        setFeedbackModal({ open: true, feedback: item, lang_hash: item.lang_hash });
    };

    const handleDelete = (item: FeedbackItemType) => {
        setIsConfirmModalOpen(true);
        setFeedbackModal({ open: false, feedback: item, lang_hash: item.lang_hash });
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!e.colDef.field) return;

        FeedbackApi.updateFeedback(e.data.id, {
            [e.colDef.field]: e.newValue,
        });

        queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
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
                field: "full_name",
                headerName: "To'liq ism",
                flex: 1,
                editable: true,
            },
            {
                field: "position",
                headerName: "Pozitsiya",
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

                                FeedbackApi.updateFeedback(params.data.id, {
                                    status: newStatus,
                                }).then(() => {
                                    queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
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
                    onPress={() => setFeedbackModal({ open: true })}
                >
                    {"Yaratish"}
                </Button>
            </div>
            <div className="grow w-full p-5">
                <AgGridTable<FeedbackItemType>
                    pagination
                    columnDefs={colDefs}
                    fetchData={FeedbackApi.getFeedbacks}
                    params={{
                        _l: lang ? lang : "uz",
                        include: "video",
                    }}
                    queryKey="feedbacks"
                    rowHeight={60}
                    sideBar={false}
                    onCellValueChanged={onUpdate}
                />
            </div>
            <ConfirmModal
                description="Siz sharhni o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="Sharhni o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deleteFeedback(feedbackDataModal.feedback?.id ?? 0)}
            />

            <FeedbackModal
                feedbackDataModal={feedbackDataModal}
                setFeedbackModal={setFeedbackModal}
            />
        </div>
    );
};
