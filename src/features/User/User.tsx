import { useMemo, useState } from "react";

import { addToast, Button, Chip, Switch, Tooltip } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash, UserCog2 } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";
import { ImagePreview } from "@/components/ImagePreview";

import { UserDetail } from "./UserDetail";

import { ConfirmModal } from "@/components";
import { Filter, UserModal } from "@/features/User";
import { UserType, userApi } from "@/services/api/user.api";

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

    const { mutate: deleteById } = useMutation({
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

    const deleteUser = (id: number) => {
        deleteById(id);
    };

    const onHandleEdit = (item: UserType) => {
        setUserModal({ open: true, user: item, lang_hash: item.lang_hash });
    };

    const onHandleDetail = (item: any) => {
        setUserDetail({ open: true, detail: item.details });
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
                field: "photo",
                headerComponent: () => (
                    <div className="!flex items-center justify-center w-full">Rasm</div>
                ),
                width: 120,
                cellRenderer: (params: ICellRendererParams) => {
                    return params.data.photo?.thumbnails?.small?.src ? (
                        <ImagePreview
                            alt={params.data.name}
                            className="w-20 h-[55px] object-cover rounded-none"
                            src={params.data.photo?.thumbnails?.small?.src}
                        />
                    ) : (
                        <div className="w-15 h-15 object-cover rounded-full bg-zinc-200" />
                    );
                },
            },
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
                field: "posts_count",
                headerName: "Postlar soni",
                flex: 1,
                editable: true,
                cellClass: "!flex items-center",
                minWidth: 150,
            },
            {
                field: "user_role.role",

                width: 120,
                editable: true,
                cellEditor: "agSelectCellEditor",
                cellClass: "!flex items-center justify-center",
                cellEditorParams: {
                    values: ["admin", "moderator", "writer"],
                },
                headerComponent: () => (
                    <div className="!flex items-center justify-center w-full">Rol</div>
                ),
                cellRenderer: (params: ICellRendererParams) => {
                    const role = params.data?.user_role?.role;

                    if (role === "admin") {
                        return (
                            <Chip className="font-medium" color="primary" size="md" variant="flat">
                                {role}
                            </Chip>
                        );
                    }

                    return <span className="text-gray-700">{role}</span>;
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
                field: "is_team",
                headerComponent: () => (
                    <div className="!flex items-center justify-center w-full">Jamoa</div>
                ),
                width: 100,
                editable: false,
                cellClass: "!flex items-center justify-center",
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <Switch
                            color="success"
                            defaultSelected={!!params.value}
                            name={`is_team-${params.data.id}`}
                            size="sm"
                            onChange={(e) => {
                                const newStatus = e.target.checked ? 1 : 0;

                                userApi
                                    .updateUser(params.data.id, {
                                        is_team: newStatus,
                                        is_columnist: false,
                                    })
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ["user"] });
                                    });
                            }}
                        />
                    );
                },
            },
            {
                field: "is_columnist",
                headerComponent: () => (
                    <div className="!flex items-center justify-center w-full">Koluminist</div>
                ),
                width: 100,
                editable: false,
                cellClass: "!flex items-center justify-center",
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <Switch
                            color="warning"
                            defaultSelected={!!params.value}
                            name={`is_columnist-${params.data.id}`}
                            size="sm"
                            onChange={(e) => {
                                const newStatus = e.target.checked ? 1 : 0;

                                userApi
                                    .updateUser(params.data.id, {
                                        is_columnist: newStatus,
                                        is_team: false,
                                    })
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ["user"] });
                                    });
                            }}
                        />
                    );
                },
            },
            {
                field: "sort",
                headerName: "Tartib raqami",
                editable: true,
                width: 150,
                cellClass: "!flex items-center justify-center",
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
                            <Button
                                isIconOnly
                                color="primary"
                                size="md"
                                variant="light"
                                onPress={() => onHandleEdit(params.data)}
                            >
                                <Pencil size={20} />
                            </Button>

                            <Tooltip content="Foydalanuvchi sozlamalari">
                                <Button
                                    isIconOnly
                                    color="primary"
                                    size="md"
                                    variant="light"
                                    onPress={() => onHandleDetail(params.data)}
                                >
                                    <UserCog2 size={20} />
                                </Button>
                            </Tooltip>

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
        [],
    );

    return (
        <div className="w-full h-full flex flex-col p-3">
            <div className="flex items-center justify-between mb-0 pl-[20px]">
                <h3 className="text-[18px] text-bold py-5">FOYDALANUVCHILAR</h3>

                {/* <TabComponent modal={false} /> */}

                <Button
                    color="primary"
                    startContent={<Plus color="white" size={18} />}
                    onPress={() => setUserModal({ open: true })}
                >
                    {"Foydalanuchi yaratish"}
                </Button>
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
                        _l: lang ? lang : "uz",
                        sort: "-id",
                        include: "details,photo",
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
