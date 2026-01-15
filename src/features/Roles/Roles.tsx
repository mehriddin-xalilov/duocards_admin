import { useMemo, useState } from "react";

import { addToast, Button, Chip } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Shield, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";
import { ConfirmModal } from "@/components";
import { RoleModal } from "./RoleModal";
import { RoleType, roleApi } from "@/services/api/role.api";

export const Roles = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [roleModal, setRoleModal] = useState<{
        open: boolean;
        role?: RoleType;
    }>({ open: false });

    const queryClient = useQueryClient();

    const { mutate: deleteById } = useMutation({
        mutationFn: (id: number) => roleApi.deleteRole(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            addToast({
                title: "Rol muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
        onError: (error: any) => {
            addToast({
                title: error?.response?.data?.message || "Xatolik yuz berdi",
                variant: "solid",
                color: "danger",
            });
        },
    });

    const deleteRole = (id: number) => {
        deleteById(id);
    };

    const onHandleEdit = (item: RoleType) => {
        setRoleModal({ open: true, role: item });
    };

    const handleDelete = (item: RoleType) => {
        setIsConfirmModalOpen(true);
        setRoleModal({ open: false, role: item });
    };

    const colDefs = useMemo<ColDef[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                width: 80,
                cellClass: "!flex items-center",
            },
            {
                field: "name",
                headerName: "Rol nomi",
                flex: 1,
                cellClass: "!flex items-center",
                minWidth: 200,
                cellRenderer: (params: ICellRendererParams) => {
                    const isAdmin = params.value === "admin";
                    return (
                        <div className="flex items-center gap-2">
                            <Shield size={18} className={isAdmin ? "text-primary" : "text-gray-500"} />
                            <span className={isAdmin ? "font-semibold" : ""}>{params.value}</span>
                        </div>
                    );
                },
            },
            {
                field: "permissions",
                headerName: "Ruxsatlar soni",
                width: 150,
                cellClass: "!flex items-center justify-center",
                cellRenderer: (params: ICellRendererParams) => {
                    const count = params.value?.length || 0;
                    return (
                        <Chip color={count > 0 ? "primary" : "default"} size="sm" variant="flat">
                            {count} ta ruxsat
                        </Chip>
                    );
                },
            },
            {
                field: "created_at",
                headerName: "Yaratilgan sana",
                width: 180,
                cellClass: "!flex items-center",
                valueFormatter: (params) => {
                    if (!params.value) return "";
                    return new Date(params.value).toLocaleDateString("uz-UZ", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    });
                },
            },
            {
                field: "action",
                width: 120,
                headerComponent: () => (
                    <div className="!flex items-center justify-center w-full">Amallar</div>
                ),
                cellClass: "!flex items-center justify-center",
                cellRenderer: (params: ICellRendererParams) => {
                    const isAdmin = params.data.name === "admin";
                    return (
                        <div className="flex gap-1">
                            <Button
                                isIconOnly
                                color="primary"
                                size="md"
                                variant="light"
                                onPress={() => onHandleEdit(params.data)}
                            >
                                <Pencil size={20} />
                            </Button>

                            <Button
                                isIconOnly
                                color="danger"
                                isDisabled={isAdmin}
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
        []
    );

    return (
        <div className="w-full h-full flex flex-col p-3">
            <div className="flex items-center justify-between mb-0 pl-[20px]">
                <h3 className="text-[18px] text-bold py-5">ROLLAR VA RUXSATLAR</h3>

                <Button
                    color="primary"
                    startContent={<Plus color="white" size={18} />}
                    onPress={() => setRoleModal({ open: true })}
                >
                    Rol yaratish
                </Button>
            </div>

            <div className="grow w-full p-5">
                <AgGridTable<RoleType>
                    pagination
                    columnDefs={colDefs}
                    fetchData={roleApi.getRoles}
                    params={{
                        sort: "-id",
                    }}
                    queryKey="roles"
                    rowHeight={65}
                    sideBar={false}
                />
            </div>

            <ConfirmModal
                description={`Siz "${roleModal.role?.name}" rolini o'chirmoqchimisiz?`}
                isOpen={isConfirmModalOpen}
                title="Rol o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deleteRole(roleModal.role?.id ?? 0)}
            />

            <RoleModal setRoleModal={setRoleModal} roleModal={roleModal} />
        </div>
    );
};
