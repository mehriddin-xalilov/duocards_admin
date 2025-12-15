import { useMemo, useState } from "react";

import { addToast, Button, Switch, Tooltip } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Eye, Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";

import { ConfirmModal } from "@/components";
import { MenuModal } from "@/features/Menu";
import { MenuProps, MenusApi } from "@/services/api/menu.api";

export const Menu = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const navigate = useNavigate();
    const [menModal, setMenuModal] = useState<{
        open: boolean;
        menus?: MenuProps | null;
        isChild?: boolean;
    }>({ open: false, menus: null });

    const queryClient = useQueryClient();
    const [lastKey, setLastKey] = useState<string | null>(null);

    const { mutate: deleteMenu } = useMutation({
        mutationFn: (id: number) => MenusApi.deleteMenu(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["menus"] });
            addToast({
                title: "Menu muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const handleDelete = (id: number) => {
        deleteMenu(id);
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!lastKey) return;

        MenusApi.updateMenu(e.data.id, {
            [e.colDef.field as string]: e.newValue,
        }).then(() => {
            queryClient.invalidateQueries({ queryKey: ["menus"] });
            setLastKey("");
        });
    };
    const onHandleEdit = (item: MenuProps) => {
        setMenuModal({ open: true, menus: item });
    };

    const colDefs = useMemo<ColDef[]>(
        () => [
            {
                field: "name.ru",
                headerName: "Menu nomi(RU)",
                flex: 1,
                minWidth: 150,
                editable: false,
                onCellClicked: ({ data }) => {
                    navigate({ to: `/menu/view/${data.id}?lang=oz` });
                },
            },
            {
                field: "sort",
                headerName: "Tartib raqami",
                editable: true,
                width: 150,
            },
            {
                field: "alias",
                headerName: "Menu aliasi",
                flex: 1,
                minWidth: 150,
                editable: true,
                onCellClicked: ({ data }) => {
                    navigate({ to: `/menu/view/${data.id}?lang=oz` });
                },
            },
            {
                field: "link",
                headerName: "Menu linki",
                flex: 1,
                minWidth: 150,
            },
            {
                field: "is_page",
                headerName: "Sahifa menusi",
                width: 200,
                editable: false,
                cellRenderer: (params: ICellRendererParams) => {
                    const isRoot = !params.data.parent_id;
                    return (
                        <Switch
                            defaultSelected={!!params.value}
                            name={`is_page-${params.data.id}`}
                            size="sm"
                            isDisabled={isRoot}
                            onChange={(e) => {
                                const newStatus = e.target.checked ? 1 : 0;

                                MenusApi.updateMenu(params.data.id, {
                                    is_page: newStatus,
                                }).then(() => {
                                    queryClient.invalidateQueries({ queryKey: ["menus"] });
                                });
                            }}
                        />
                    );
                },
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

                                MenusApi.updateMenu(params.data.id, {
                                    status: newStatus,
                                }).then(() => {
                                    queryClient.invalidateQueries({ queryKey: ["menus"] });
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
                cellClass: "!flex items-center justify-center",
                cellRenderer: (params: ICellRendererParams) => {
                    const isRoot = !params.data.parent_id;
                    return (
                        <div className="flex gap-1 items-center">
                            <Button
                                isIconOnly
                                color="primary"
                                size="sm"
                                variant="light"
                                onPress={() =>
                                    setMenuModal({
                                        open: true,
                                        menus: params.data,
                                        isChild: true,
                                    })
                                }
                            >
                                <Tooltip content="Sub menyu yaratish">
                                    <Plus size={16} />
                                </Tooltip>
                            </Button>
                            <Button
                                isIconOnly
                                color="primary"
                                size="md"
                                variant="light"
                                onPress={() => onHandleEdit(params.data)}
                            >
                                <Pencil size={20} />
                            </Button>
                            {!isRoot && (
                                <Button
                                    isIconOnly
                                    color="primary"
                                    size="md"
                                    variant="light"
                                    onPress={() =>
                                        navigate({ to: `/menu/view/${params.data.id}?lang=oz` })
                                    }
                                >
                                    <Eye size={20} />
                                </Button>
                            )}

                            <Button
                                isIconOnly
                                color="danger"
                                size="md"
                                variant="light"
                                onPress={() => handleDelete(params.data.id)}
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

    const autoGroupColumnDef = useMemo<ColDef>(() => {
        return {
            field: "name.uz",
            headerName: "Menu nomi(UZ)",
            flex: 1,
            minWidth: 150,
            editable: false,
        };
    }, []);

    return (
        <div className="flex flex-col w-full h-full p-3">
            <ConfirmModal
                description="Siz menu ni o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="Menu ni o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => handleDelete(menModal.menus?.id ?? 0)}
            />

            <div className="flex items-center justify-between px-[20px] mt-3">
                <h3 className="font-bold text-[20px]">MENULAR</h3>

                <Button
                    color="primary"
                    startContent={<Plus color="white" size={18} />}
                    onPress={() => setMenuModal({ open: true })}
                >
                    {"Yaratish"}
                </Button>
            </div>

            <MenuModal
                isOpen={menModal.open}
                menus={menModal.menus ?? null}
                isChild={Boolean(menModal.isChild)}
                name="menus"
                onClose={() => setMenuModal({ open: false, menus: null })}
            />

            <div className="grow w-full p-5">
                <AgGridTable<MenuProps>
                    pagination
                    autoGroupColumnDef={autoGroupColumnDef}
                    columnDefs={colDefs}
                    fetchData={MenusApi.getMenus}
                    params={{
                        per_page: 20,
                        include: "children",
                        sort: "-id",
                    }}
                    queryKey="menus"
                    sideBar={false}
                    onCellKeyDown={(e) => {
                        if (e.event && "key" in e.event) {
                            setLastKey((e.event as KeyboardEvent).key);
                        }
                    }}
                    onCellValueChanged={onUpdate}
                    treeData={true}
                    treeDataChildrenField="children"
                />
            </div>
        </div>
    );
};
