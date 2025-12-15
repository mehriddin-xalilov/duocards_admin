import { useMemo, useState } from "react";

import { addToast, Button, Switch } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";

import { ConfirmModal } from "@/components";
import { TypesModal, Filter } from "@/features/Types";
import { TypesItemType, TypesApi } from "@/services/api/types.api";

export const Types = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [TypesModalData, setTypeModalData] = useState<{
        open: boolean;
        types?: TypesItemType | null;
        isChild?: boolean;
    }>({ open: false, types: null, isChild: false });

    const searchParams = useSearch({ from: "/_main" });

    const { title } = searchParams;

    const queryClient = useQueryClient();

    const [lastKey, setLastKey] = useState<string | null>(null);

    const { mutate: deleteTypes } = useMutation({
        mutationFn: (id: number) => TypesApi.deleteTypes(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["types"] });
            addToast({
                title: "Tur muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const handleDelete = (id: number) => {
        deleteTypes(id);
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!lastKey) return;

        TypesApi.updateTypes(e.data.id, {
            [e.colDef.field as string]: e.newValue,
        }).then(() => {
            queryClient.invalidateQueries({ queryKey: ["types"] });
            setLastKey("");
        });
    };

    const onHandleEdit = (item: TypesItemType) => {
        setTypeModalData({ open: true, types: item });
    };

    const colDefs = useMemo<ColDef[]>(
        () => [
            // {
            //     field: "name.oz",
            //     headerName: "Sarlavha (OZ)",
            //     flex: 1,
            //     valueGetter: (params) => params.data?.name?.oz ?? "",
            //     valueSetter: (params) => {
            //         params.data.name.oz = params.newValue;
            //         return true;
            //     },
            // },
            {
                field: "name.ru",
                headerName: "Sarlavha (RU)",
                flex: 1,
                valueGetter: (params) => params.data?.name?.ru ?? "",
                valueSetter: (params) => {
                    params.data.name.ru = params.newValue;
                    return true;
                },
            },
            // {
            //     field: "name.en",
            //     headerName: "Sarlavha (EN)",
            //     flex: 1,
            //     valueGetter: (params) => params.data?.name?.en ?? "",
            //     valueSetter: (params) => {
            //         params.data.name.en = params.newValue;
            //         return true;
            //     },
            // },

            {
                field: "status",
                headerName: "Status",
                width: 100,
                editable: false,
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <div className="h-full flex items-center">
                            <Switch
                                defaultSelected={!!params.value}
                                name={`status-${params.data.id}`}
                                size="sm"
                                onChange={(e) => {
                                    const newStatus = e.target.checked ? 1 : 0;

                                    TypesApi.updateTypes(params.data.id, {
                                        status: newStatus,
                                    }).then(() => {
                                        queryClient.invalidateQueries({ queryKey: ["types"] });
                                    });
                                }}
                            />
                        </div>
                    );
                },
            },
            {
                field: "action",
                headerName: "Action",
                cellRenderer: (params: ICellRendererParams) => {
                    // const isRoot = !params.data.parent_id;

                    return (
                        <div className="h-full flex items-center gap-2">
                            {/* {isRoot && (
                                <Button
                                    isIconOnly
                                    color="primary"
                                    size="sm"
                                    variant="light"
                                    onPress={() =>
                                        setTypeModalData({
                                            open: true,
                                            isChild: true,
                                            categories: params.data,
                                        })
                                    }
                                >
                                    <Tooltip content="Sub kategoriya yaratish">
                                        <Plus size={16} />
                                    </Tooltip>
                                </Button>
                            )} */}

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
                                onPress={() => handleDelete(params.data.id)}
                            >
                                <Trash size={16} />
                            </Button>
                        </div>
                    );
                },
                width: 150,
            },
        ],
        [],
    );

    const autoGroupColumnDef = useMemo<ColDef>(() => {
        return {
            field: "name.uz",
            headerName: "Sarlavha (UZ)",
            cellRenderer: "agGroupCellRenderer",
        };
    }, []);

    return (
        <div className="flex flex-col w-full h-full p-3">
            <ConfirmModal
                description="Siz turni ni o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="Tur ni o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => handleDelete(TypesModalData.types?.id ?? 0)}
            />
            <div className="flex items-center justify-between px-[20px]">
                <h3 className="py-5 font-bold text-[20px]">TURLAR</h3>

                <Button
                    color="primary"
                    startContent={<Plus color="white" size={18} />}
                    onPress={() => setTypeModalData({ open: true })}
                >
                    {"Tur yaratish"}
                </Button>
            </div>

            <Filter />

            <TypesModal
                types={TypesModalData.types ?? null}
                isChild={TypesModalData.isChild}
                isOpen={TypesModalData.open}
                name="types"
                onClose={() => setTypeModalData({ open: false, types: null })}
            />

            <div className="grow w-full p-5">
                <AgGridTable<TypesItemType>
                    pagination
                    autoGroupColumnDef={autoGroupColumnDef}
                    columnDefs={colDefs}
                    fetchData={TypesApi.getTypes}
                    params={{
                        per_page: 20,
                        // sort: "-sort",
                        title: title,
                    }}
                    queryKey="types"
                    sideBar={false}
                    treeData={true}
                    treeDataChildrenField="children"
                    onCellKeyDown={(e) => {
                        if (e.event && "key" in e.event) {
                            setLastKey((e.event as KeyboardEvent).key);
                        }
                    }}
                    onCellValueChanged={onUpdate}
                />
            </div>
        </div>
    );
};
