import { useMemo, useState } from "react";

import { addToast, Button, Switch } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";

import { ConfirmModal } from "@/components";
import { DocumentsModal } from "@/features/Documents";
import { DocumentItemType, documentApi } from "@/services/api/documents.api";

export const Documents = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [documentDataModal, setDocumentModal] = useState<{
        open: boolean;
        document?: DocumentItemType;
    }>({ open: false });

    const queryClient = useQueryClient();

    const { mutate: deleteById } = useMutation({
        mutationFn: (id: number) => documentApi.deleteDocument(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["document"] });
            addToast({
                title: "Muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const deleteDocument = (id: number) => {
        deleteById(id);
    };

    const onHandleEdit = (item: DocumentItemType) => {
        setDocumentModal({ open: true, document: item });
    };

    const handleDelete = (item: DocumentItemType) => {
        setIsConfirmModalOpen(true);
        setDocumentModal({ open: false, document: item });
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!e.colDef.field) return;

        documentApi.updateDocument(e.data.id, {
            [e.colDef.field]: e.newValue,
        });

        queryClient.invalidateQueries({ queryKey: ["document"] });
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

                                documentApi
                                    .updateDocument(params.data.id, {
                                        status: newStatus,
                                    })
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ["document"] });
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
                    onPress={() => setDocumentModal({ open: true })}
                >
                    {"Yaratish"}
                </Button>
            </div>
            <div className="grow w-full p-5">
                <AgGridTable<DocumentItemType>
                    pagination
                    columnDefs={colDefs}
                    fetchData={documentApi.getDocuments}
                    params={{
                        sort: "-id",
                        include: "documents",
                    }}
                    queryKey="document"
                    rowHeight={60}
                    sideBar={false}
                    onCellValueChanged={onUpdate}
                />
            </div>
            <ConfirmModal
                description="Siz rostdan o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="O'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deleteDocument(documentDataModal.document?.id ?? 0)}
            />

            <DocumentsModal
                documentDataModal={documentDataModal}
                setDocumentModal={setDocumentModal}
            />
        </div>
    );
};
