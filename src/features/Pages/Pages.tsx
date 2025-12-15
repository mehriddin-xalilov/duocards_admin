import { useMemo, useState } from "react";

import { addToast, Button, Switch } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";

import { ConfirmModal } from "@/components";
import { TabComponent } from "@/features/Pages";
import { PagesItemType, pagesApi } from "@/services/api/pages.api";

export const Pages = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const navigate = useNavigate({ from: "/pages" });
    const [tabLang, setTabLang] = useState("uz");

    const [pageModal, setPageModal] = useState<{
        open: boolean;
        page?: PagesItemType;
        lang_hash?: string;
    }>({ open: false });

    const queryClient = useQueryClient();

    const { mutate: deleteById } = useMutation({
        mutationFn: (id: number) => pagesApi.deletePage(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["pages"] });
            addToast({
                title: "Sahifa iqtibosi muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const deletePage = (id: number) => {
        deleteById(id);
    };

    const handleDelete = (item: PagesItemType) => {
        setIsConfirmModalOpen(true);
        setPageModal({ open: false, page: item, lang_hash: item.lang_hash });
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!e.colDef.field) return;

        pagesApi.updatePage(e.data.id, {
            [e.colDef.field]: e.newValue,
        });

        queryClient.invalidateQueries({ queryKey: ["pages"] });
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
                field: "title",
                headerName: "Sahifa sarlavhasi",
                flex: 1,
                minWidth: 150,
                editable: true,
                cellClass: "!flex items-center",
            },
            {
                field: "description",
                headerName: "Sahifa tavsifi",
                flex: 1,
                minWidth: 150,
                editable: true,
                cellClass: "!flex items-center",
            },
            {
                field: "slug",
                headerName: "Sahifa slugi",
                flex: 0.5,
                minWidth: 150,
                editable: true,
                cellClass: "!flex items-center",
            },
            {
                field: "status",
                headerName: "Status",
                cellClass: "!flex items-center",

                width: 100,
                editable: false,
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <Switch
                            defaultSelected={!!params.value}
                            name={`status-${params.data.id}`}
                            size="sm"
                            onChange={(e) => {
                                const newStatus = e.target.checked ? 1 : 0;

                                pagesApi
                                    .updatePage(params.data.id, {
                                        status: newStatus,
                                    })
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ["pages"] });
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
                cellClass: "!flex items-center justify-center w-full",
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <div className="flex gap-1">
                            <Button
                                isIconOnly
                                color="primary"
                                size="md"
                                variant="light"
                                onPress={() => {
                                    navigate({
                                        to: `/pages/update/${params.data.id}?lang=${tabLang}`,
                                    });
                                }}
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
        [tabLang],
    );

    return (
        <div className="w-full h-full flex flex-col p-3">
            <div className="flex items-center justify-between mt-3 px-[20px]">
                <TabComponent modal={false} setTabLang={setTabLang} />

                {tabLang && (
                    <Button
                        color="primary"
                        startContent={<Plus color="white" size={18} />}
                        onPress={() => navigate({ to: `/pages/create?lang=${tabLang}` })}
                    >
                        {"Sahifa yaratish"}
                    </Button>
                )}
            </div>
            <div className="grow w-full p-5">
                <AgGridTable<PagesItemType>
                    pagination
                    columnDefs={colDefs}
                    fetchData={pagesApi.getPages}
                    params={{
                        _l: tabLang ? tabLang : "uz",
                    }}
                    queryKey="pages"
                    rowHeight={60}
                    sideBar={false}
                    onCellValueChanged={onUpdate}
                />
            </div>
            <ConfirmModal
                description="Siz sahifani  o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="Sahifa o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deletePage(pageModal.page?.id ?? 0)}
            />

            {/* <QuoteModal quoteModal={quoteModal} setPageModal={setPageModal} /> */}
        </div>
    );
};
