import { useMemo, useState } from "react";

import { addToast, Button, Chip, Switch } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";
import { ConfirmModal } from "@/components";
import { Filter, UserModal } from "@/features/User";
import { usePermission } from "@/hooks/usePermission";
import { UserType, userApi } from "@/services/api/user.api";
import { useConfirmModalStore } from "@/store/confirm-modal.store";
import { UserDetail } from "./UserDetail";

export const User = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const search = useSearch({ from: "/_main/user" });

    const { lang } = search;

    const [lastKey, setLastKey] = useState<string | null>(null);

    const [userModal, setUserModal] = useState<{
        open: boolean;
        user?: UserType;
        lang_hash?: string;
    }>({ open: false });

    const [userDetail, setUserDetail] = useState<{
        open: boolean;
        detail?: UserType;
    }>({ open: false });

    const queryClient = useQueryClient();
    const router = useSearch({ from: "/_main/user" });
    const { can } = usePermission();

    const { mutate: deleteUser, isPending: isDeleting } = useMutation({
        mutationFn: (id: number) => userApi.deleteUser(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["user"] });
            addToast({
                title: "Foydalanuvchi muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const onHandleCreate = () => {
        setUserModal({ open: true });
    };

    const onHandleEdit = (item: UserType) => {
        setUserModal({ open: true, user: item, lang_hash: item.lang_hash });
    };



    const handleDelete = (item: UserType) => {
        setIsConfirmModalOpen(true);
        setUserModal({ open: false, user: item, lang_hash: item.lang_hash });
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!e.colDef.field) return;
        if (!lastKey) return;

        if (e.colDef.field.includes("user_role")) {
            userApi
                .updateUser(e.data.id, {
                    role: e.newValue,
                })
                .then(() => {
                    queryClient.invalidateQueries({ queryKey: ["user"] });
                    setLastKey("");
                });
        } else {
            userApi
                .updateUser(e.data.id, {
                    [e.colDef.field]: e.newValue,
                })
                .then(() => {
                    queryClient.invalidateQueries({ queryKey: ["user"] });
                    setLastKey("");
                });
        }
    };

    const colDefs = useMemo<ColDef[]>(
        () => [
            {
                field: "name",
                headerName: "Ism",
                flex: 1,
                editable: true,
                cellClass: "!flex items-center",
                minWidth: 150,
            },
            {
                field: "login",
                headerName: "Login",
                flex: 1,
                editable: true,
                cellClass: "!flex items-center",
                minWidth: 150,
            },
            {
                field: "email",
                headerName: "Email",
                flex: 1,
                cellClass: "!flex items-center",
                minWidth: 180,
            },
            {
                field: "phone",
                headerName: "Telefon",
                width: 150,
                cellClass: "!flex items-center",
            },
            {
                field: "roles",
                width: 120,
                cellClass: "!flex items-center justify-center",
                headerComponent: () => (
                    <div className="!flex items-center justify-center w-full">Rol</div>
                ),
                cellRenderer: (params: ICellRendererParams) => {
                    const role = params.data?.roles?.[0]?.name;

                    if (role === "admin") {
                        return (
                            <Chip className="font-medium" color="primary" size="md" variant="flat">
                                {role}
                            </Chip>
                        );
                    }

                    return <span className="text-gray-700 capitalize">{role || 'client'}</span>;
                },
            },
            {
                field: "status",
                headerComponent: () => (
                    <div className="!flex items-center justify-center w-full">Status</div>
                ),
                width: 100,
                cellClass: "!flex items-center justify-center",
                editable: false,
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <Switch
                            defaultSelected={!!params.value}
                            name={`status-${params.data.id}`}
                            size="sm"
                            onChange={(e) => {
                                const newStatus = e.target.checked ? 1 : 0;

                                userApi
                                    .updateUser(params.data.id, { status: newStatus })
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ["user"] });
                                    });
                            }}
                        />
                    );
                },
            },
            {
                field: "action",
                width: 150,
                headerComponent: () => (
                    <div className="!flex items-center justify-center w-full">Amallar</div>
                ),
                cellClass: "!flex items-center justify-center",
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <div className="flex gap-1">
                            {can("users.update") && (
                                <Button
                                    isIconOnly
                                    color="primary"
                                    size="md"
                                    variant="light"
                                    onPress={() => onHandleEdit(params.data)}
                                >
                                    <Pencil size={20} />
                                </Button>
                            )}

                            {can("users.delete") && (
                                <Button
                                    isIconOnly
                                    color="danger"
                                    size="md"
                                    variant="light"
                                    onPress={() => handleDelete(params.data)}
                                >
                                    <Trash size={20} />
                                </Button>
                            )}
                        </div>
                    );
                },
            },
        ],
        [],
    );

    return (
        <div className="w-full h-full flex flex-col p-3">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Foydalanuvchilar</h1>
                {can("users.create") && (
                    <Button color="primary" startContent={<Plus size={20} />} onPress={onHandleCreate}>
                        Qo'shish
                    </Button>
                )}
            </div>

            <div className="pl-5">
                <Filter />
            </div>

            <div className="grow w-full p-5">
                <AgGridTable<UserType>
                    pagination
                    columnDefs={colDefs}
                    fetchData={userApi.getUsers}
                    params={{
                        sort: "-id",
                        filter: {
                            name: search.search,
                        },
                    }}
                    queryKey="user"
                    rowHeight={65}
                    sideBar={false}
                    onCellKeyDown={(e) => {
                        if (e.event && "key" in e.event) {
                            setLastKey((e.event as KeyboardEvent).key);
                        }
                    }}
                    onCellValueChanged={onUpdate}
                />
            </div>

            <ConfirmModal
                description="Siz foydalanuvchini o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="Foydalanuvchi o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deleteUser(userModal.user?.id ?? 0)}
            />

            {userDetail.detail && (
                <UserDetail setUserDetail={setUserDetail} userDetail={userDetail} />
            )}

            <UserModal setUserModal={setUserModal} userModal={userModal} />
        </div>
    );
};
