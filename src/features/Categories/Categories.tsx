import { useMemo, useState } from "react";

import { addToast, Button } from "@heroui/react";
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
            {
                field: "action",
                headerName: "Action",
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <div className="h-full flex items-center gap-2">
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
            field: "name",
            headerName: "Fan nomi",
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
                        sort: "-id",
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
