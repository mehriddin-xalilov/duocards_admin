import { useEffect, useState } from "react";

import {
    addToast,
    Button,
    Checkbox,
    CheckboxGroup,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Shield } from "lucide-react";

import { RoleType, GroupedPermission, roleApi, permissionApi } from "@/services/api/role.api";

type RoleModalProps = {
    roleModal: {
        open: boolean;
        role?: RoleType;
    };
    setRoleModal: (modal: { open: boolean; role?: RoleType }) => void;
};

export const RoleModal = ({ roleModal, setRoleModal }: RoleModalProps) => {
    const [roleName, setRoleName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    const queryClient = useQueryClient();

    // Fetch permissions
    const { data: permissionsData, isLoading: isLoadingPermissions } = useQuery({
        queryKey: ["permissions"],
        queryFn: () => permissionApi.getPermissions<{ all: any[]; grouped: GroupedPermission[] }>(),
        enabled: roleModal.open,
    });

    // Initialize form when editing
    useEffect(() => {
        if (roleModal.role) {
            setRoleName(roleModal.role.name);
            setSelectedPermissions(roleModal.role.permissions?.map((p) => p.name) || []);
        } else {
            setRoleName("");
            setSelectedPermissions([]);
        }
    }, [roleModal.role]);

    const { mutate: createRole, isPending: isCreating } = useMutation({
        mutationFn: (data: { name: string; permissions: string[] }) => roleApi.createRole(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            addToast({
                title: "Rol muvaffaqiyatli yaratildi",
                variant: "solid",
                color: "success",
            });
            handleClose();
        },
        onError: (error: any) => {
            addToast({
                title: error?.response?.data?.message || "Xatolik yuz berdi",
                variant: "solid",
                color: "danger",
            });
        },
    });

    const { mutate: updateRole, isPending: isUpdating } = useMutation({
        mutationFn: (data: { id: number; name: string; permissions: string[] }) =>
            roleApi.updateRole(data.id, { name: data.name, permissions: data.permissions }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            addToast({
                title: "Rol muvaffaqiyatli yangilandi",
                variant: "solid",
                color: "success",
            });
            handleClose();
        },
        onError: (error: any) => {
            addToast({
                title: error?.response?.data?.message || "Xatolik yuz berdi",
                variant: "solid",
                color: "danger",
            });
        },
    });

    const handleClose = () => {
        setRoleModal({ open: false });
        setRoleName("");
        setSelectedPermissions([]);
    };

    const handleSubmit = () => {
        if (!roleName.trim()) {
            addToast({
                title: "Rol nomini kiriting",
                variant: "solid",
                color: "warning",
            });
            return;
        }

        if (roleModal.role) {
            updateRole({
                id: roleModal.role.id,
                name: roleName,
                permissions: selectedPermissions,
            });
        } else {
            createRole({
                name: roleName,
                permissions: selectedPermissions,
            });
        }
    };

    const handleSelectAll = (resource: string, permissions: { name: string }[]) => {
        const resourcePermissions = permissions.map((p) => p.name);
        const allSelected = resourcePermissions.every((p) => selectedPermissions.includes(p));

        if (allSelected) {
            // Deselect all from this resource
            setSelectedPermissions((prev) => prev.filter((p) => !resourcePermissions.includes(p)));
        } else {
            // Select all from this resource
            setSelectedPermissions((prev) => {
                const newPerms = [...prev];
                resourcePermissions.forEach((p) => {
                    if (!newPerms.includes(p)) {
                        newPerms.push(p);
                    }
                });
                return newPerms;
            });
        }
    };

    const isPending = isCreating || isUpdating;

    return (
        <Modal
            isOpen={roleModal.open}
            scrollBehavior="inside"
            size="3xl"
            onClose={handleClose}
        >
            <ModalContent>
                <ModalHeader className="flex items-center gap-2">
                    <Shield className="text-primary" size={24} />
                    <span>{roleModal.role ? "Rolni tahrirlash" : "Yangi rol yaratish"}</span>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        {/* Role Name Input */}
                        <Input
                            isRequired
                            label="Rol nomi"
                            placeholder="Masalan: moderator, editor"
                            value={roleName}
                            variant="bordered"
                            onChange={(e) => setRoleName(e.target.value)}
                        />

                        {/* Permissions Section */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Ruxsatlar</h4>

                            {isLoadingPermissions ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="animate-spin text-primary" size={32} />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {permissionsData?.data?.grouped?.map((group) => {
                                        const resourcePermissions = group.permissions.map((p) => p.name);
                                        const allSelected = resourcePermissions.every((p) =>
                                            selectedPermissions.includes(p)
                                        );
                                        const someSelected = resourcePermissions.some((p) =>
                                            selectedPermissions.includes(p)
                                        );

                                        return (
                                            <div
                                                key={group.resource}
                                                className="border border-gray-200 rounded-lg p-4"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <h5 className="font-semibold text-md capitalize">
                                                        {group.resource}
                                                    </h5>
                                                    <Button
                                                        color={allSelected ? "danger" : "primary"}
                                                        size="sm"
                                                        variant="flat"
                                                        onPress={() =>
                                                            handleSelectAll(group.resource, group.permissions)
                                                        }
                                                    >
                                                        {allSelected ? "Hammasini olib tashlash" : "Hammasini tanlash"}
                                                    </Button>
                                                </div>

                                                <CheckboxGroup
                                                    value={selectedPermissions}
                                                    onChange={(values) => setSelectedPermissions(values as string[])}
                                                >
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        {group.permissions.map((permission) => (
                                                            <Checkbox
                                                                key={permission.id}
                                                                classNames={{
                                                                    label: "text-sm",
                                                                }}
                                                                value={permission.name}
                                                            >
                                                                <span className="capitalize">
                                                                    {permission.action || permission.name}
                                                                </span>
                                                            </Checkbox>
                                                        ))}
                                                    </div>
                                                </CheckboxGroup>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Selected Count */}
                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                            <p className="text-sm text-primary-700">
                                <strong>{selectedPermissions.length}</strong> ta ruxsat tanlandi
                            </p>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={handleClose}>
                        Bekor qilish
                    </Button>
                    <Button
                        color="primary"
                        isLoading={isPending}
                        onPress={handleSubmit}
                    >
                        {roleModal.role ? "Yangilash" : "Yaratish"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
