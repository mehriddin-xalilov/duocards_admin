import { useMemo, useState } from "react";

import { addToast, Button, Switch } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";

import { ConfirmModal } from "@/components";
import { CategoriesModal, Filter } from "@/features/Categories";
import { CategoriesItemType, CategoriesApi } from "@/services/api/categories.api";

export const Categories = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [CategoriesModalData, setCategoriesModal] = useState<{
        open: boolean;
        categories?: CategoriesItemType | null;
        lang_hash?: string;
        isChild?: boolean;
    }>({ open: false, categories: null, isChild: false });

    const searchParams = useSearch({ from: "/_main" });

    const { title } = searchParams;

    const queryClient = useQueryClient();

    const [lastKey, setLastKey] = useState<string | null>(null);

    const { mutate: detleteCategories } = useMutation({
        mutationFn: (id: number) => CategoriesApi.deleteCategories(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            addToast({
                title: "Kategoriya muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const handleDelete = (id: number) => {
        detleteCategories(id);
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!lastKey) return;

        CategoriesApi.updateCategories(e.data.id, {
            [e.colDef.field as string]: e.newValue,
        }).then(() => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setLastKey("");
        });
    };

    const onHandleEdit = (item: CategoriesItemType) => {
        setCategoriesModal({ open: true, categories: item });
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
                field: "slug",
                headerName: "Slug",
                flex: 1,
            },
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

                                    CategoriesApi.updateCategories(params.data.id, {
                                        status: newStatus,
                                    }).then(() => {
                                        queryClient.invalidateQueries({ queryKey: ["categories"] });
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
                                        setCategoriesModal({
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
                description="Siz kategoriya ni o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="Kategoriya ni o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => handleDelete(CategoriesModalData.categories?.id ?? 0)}
            />
            <div className="flex items-center justify-between px-[20px]">
                <h3 className="py-5 font-bold text-[20px]">KATEGORIYALAR</h3>

                <Button
                    color="primary"
                    startContent={<Plus color="white" size={18} />}
                    onPress={() => setCategoriesModal({ open: true })}
                >
                    {"Kategoriya yaratish"}
                </Button>
            </div>

            <Filter />

            <CategoriesModal
                categories={CategoriesModalData.categories ?? null}
                isChild={CategoriesModalData.isChild}
                isOpen={CategoriesModalData.open}
                name="categories"
                onClose={() => setCategoriesModal({ open: false, categories: null })}
            />

            <div className="grow w-full p-5">
                <AgGridTable<CategoriesItemType>
                    pagination
                    autoGroupColumnDef={autoGroupColumnDef}
                    columnDefs={colDefs}
                    fetchData={CategoriesApi.getCategories}
                    params={{
                        per_page: 20,
                        // sort: "-sort",
                        title: title,
                    }}
                    queryKey="categories"
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
