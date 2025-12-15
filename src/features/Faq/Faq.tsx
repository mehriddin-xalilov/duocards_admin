import { useMemo, useState } from "react";

import { addToast, Button, Switch } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";

import { ConfirmModal } from "@/components";
import { FaqModal, TabComponent } from "@/features/Faq";
import { FaqItemType, faqApi } from "@/services/api/faq.api";

export const Faq = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const search = useSearch({ from: "/_main/faqs" });
    const { lang } = search;
    const [faqDataModal, setFaqModal] = useState<{
        open: boolean;
        faq?: FaqItemType;
        lang_hash?: string;
    }>({ open: false });

    const queryClient = useQueryClient();

    const { mutate: deleteById } = useMutation({
        mutationFn: (id: number) => faqApi.deleteFaq(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
            addToast({
                title: "Savol muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const deleteFaq = (id: number) => {
        deleteById(id);
    };

    const onHandleEdit = (item: FaqItemType) => {
        setFaqModal({ open: true, faq: item, lang_hash: item.lang_hash });
    };

    const handleDelete = (item: FaqItemType) => {
        setIsConfirmModalOpen(true);
        setFaqModal({ open: false, faq: item, lang_hash: item.lang_hash });
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!e.colDef.field) return;

        faqApi.updateFaq(e.data.id, {
            [e.colDef.field]: e.newValue,
        });

        queryClient.invalidateQueries({ queryKey: ["faqs"] });
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
                field: "question",
                headerName: "Savol",
                flex: 1,
                editable: true,
            },
            {
                field: "answer",
                headerName: "Javob",
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

                                faqApi
                                    .updateFaq(params.data.id, {
                                        status: newStatus,
                                    })
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ["faqs"] });
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
                    onPress={() => setFaqModal({ open: true })}
                >
                    {"Yaratish"}
                </Button>
            </div>
            <div className="grow w-full p-5">
                <AgGridTable<FaqItemType>
                    pagination
                    columnDefs={colDefs}
                    fetchData={faqApi.getFaqs}
                    params={{
                        _l: lang ? lang : "uz",
                    }}
                    queryKey="faqs"
                    rowHeight={60}
                    sideBar={false}
                    onCellValueChanged={onUpdate}
                />
            </div>
            <ConfirmModal
                description="Siz savolni o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="Savolni o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deleteFaq(faqDataModal.faq?.id ?? 0)}
            />

            <FaqModal faqDataModal={faqDataModal} setFaqModal={setFaqModal} />
        </div>
    );
};
