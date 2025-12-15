import { useMemo, useState } from "react";

import { addToast, Button, Switch, Tooltip } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { ArrowLeft, Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";

import { ConfirmModal } from "@/components";
import { MenuItemsModal } from "@/features/Menu";
import { MenusApi, MenuItemProps } from "@/services/api/menu.api";
import { ImagePreview } from "@/components/ImagePreview";

export const MenuItems = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const search = useSearch({ from: "/_main/menu/view/$id" });
    const { id } = useParams({ from: "/_main/menu/view/$id" });
    const { lang } = search;
    const navigate = useNavigate();
    const [MenuModalData, setMenuItemsModal] = useState<{
        open: boolean;
        menuItem?: MenuItemProps;
        isChild?: boolean;
    }>({ open: false });

    const queryClient = useQueryClient();

    const { mutate: deleteById } = useMutation({
        mutationFn: (id: number) => MenusApi.deleteMenuItem(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["menuitems"] });
            addToast({
                title: "Menu muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const deleteMenuItems = (id: number) => {
        deleteById(id);
    };

    const onHandleEdit = (item: MenuItemProps) => {
        setMenuItemsModal({ open: true, menuItem: item });
    };

    const handleDelete = (item: MenuItemProps) => {
        setIsConfirmModalOpen(true);
        setMenuItemsModal({ open: false, menuItem: item });
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!e.colDef.field) return;

        MenusApi.updateMenuItem(e.data.id, {
            [e.colDef.field]: e.newValue,
        });

        queryClient.invalidateQueries({ queryKey: ["menuitems"] });
    };

    const colDefs = useMemo<ColDef[]>(
        () => [
            {
                field: "icon",
                headerName: "Icon",
                width: 120,
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <ImagePreview
                            alt={params.data.name}
                            className="w-20 h-[55px] object-cover rounded-none"
                            src={params.data.icon?.thumbnails?.small?.src}
                        />
                    );
                },
            },
            {
                field: "name.ru",
                headerName: "Nomi (RU)",
                flex: 1,
                valueGetter: (params) => params.data?.name?.ru ?? "",
                valueSetter: (params) => {
                    params.data.name.ru = params.newValue;
                    return true;
                },
            },

            // {
            //     field: "name.en",
            //     headerName: "Nomi (EN)",
            //     flex: 1,
            //     valueGetter: (params) => params.data?.name?.en ?? "",
            //     valueSetter: (params) => {
            //         params.data.name.en = params.newValue;
            //         return true;
            //     },
            // },
            {
                field: "slug",
                headerName: "Menu slugi",
                flex: 1,
                minWidth: 150,
                editable: true,
            },

            {
                field: "sort",
                headerName: "Tartib raqami",
                editable: true,
                width: 150,
            },

            {
                field: "status",
                headerName: "Status",
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

                                MenusApi.updateMenuItem(params.data.id, {
                                    status: newStatus,
                                }).then(() => {
                                    queryClient.invalidateQueries({ queryKey: ["menuitems"] });
                                });
                            }}
                        />
                    );
                },
            },
            {
                field: "action",
                headerName: "Action",
                cellRenderer: (params: ICellRendererParams) => {
                    const isRoot = !params.data.parent_id;

                    return (
                        <div className="flex gap-2">
                            {isRoot && (
                                <Button
                                    isIconOnly
                                    color="primary"
                                    size="sm"
                                    variant="light"
                                    onPress={() =>
                                        setMenuItemsModal({
                                            open: true,
                                            isChild: true,
                                            menuItem: params.data,
                                        })
                                    }
                                >
                                    <Tooltip content="Sub kategoriya yaratish">
                                        <Plus size={16} />
                                    </Tooltip>
                                </Button>
                            )}
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
    const autoGroupColumnDef = useMemo<ColDef>(() => {
        return {
            field: "name.uz",
            headerName: "Nomi (UZ)",
            cellRenderer: "agGroupCellRenderer",
            editable: false,
        };
    }, []);
    return (
        <div className="w-full h-full flex flex-col p-3">
            <Button
                className="w-fit mb-5 ml-[20px]"
                color="default"
                radius="sm"
                startContent={<ArrowLeft size={18} />}
                variant="flat"
                onPress={() => navigate({ to: "/menu" })}
            >
                Orqaga
            </Button>
            <div className="flex items-center justify-between mb-3 pl-[20px]">
                <Button
                    color="primary"
                    startContent={<Plus color="white" size={18} />}
                    onPress={() => setMenuItemsModal({ open: true })}
                >
                    {"Yaratish"}
                </Button>
            </div>
            <div className="grow w-full p-5">
                <AgGridTable<MenuItemProps>
                    pagination
                    autoGroupColumnDef={autoGroupColumnDef}
                    columnDefs={colDefs}
                    fetchData={MenusApi.viewMenuItems}
                    params={{
                        _l: lang ? lang : "uz",
                        menu_id: id,
                        include: "children,icon",
                        sort: "id",
                    }}
                    queryKey="menuitems"
                    rowHeight={60}
                    sideBar={false}
                    treeData={true}
                    treeDataChildrenField="children"
                    onCellValueChanged={onUpdate}
                />
            </div>
            <ConfirmModal
                description="Siz menuni o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="Menuni o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deleteMenuItems(MenuModalData.menuItem?.id ?? 0)}
            />

            <MenuItemsModal MenuModalData={MenuModalData} setMenuItemsModal={setMenuItemsModal} />
        </div>
    );
};
