import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { Form, FormFields, Modal } from "@/components";
import { UploadResponse } from "@/services/api/file.api";
import { userApi, UserType } from "@/services/api/user.api";

type userModalProps = {
    setUserModal: ({
        open,
        user,
        lang_hash,
    }: {
        open: boolean;
        user?: UserType;
        lang_hash?: string;
    }) => void;
    userModal: { open: boolean; user?: UserType; lang_hash?: string };
};

export const UserModal = (props: userModalProps) => {
    const {
        userModal: { open, user },
        setUserModal,
    } = props;
    const queryClient = useQueryClient();

    // useEffect(() => {
    //     if (search.lang) {
    //         setLang(search.lang ? search.lang : "oz");
    //     }
    // }, [search.lang]);

    const onClose = () => {
        setUserModal({ open: false });
    };

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Foydalanuvchi muvaffaqiyatli yaratildi",
        });
    };

    return (
        <Modal
            className=" max-w-[30%]"
            header={user ? "Foydalanuvchini o'zgartirish" : "Foydalanuvchi yaratish"}
            isOpen={open}
            onClose={onClose}
        >
            {/* <TabComponent modal={true} onChange={onChange} /> */}

            <Form
                key={user?.id}
                fetchFunction={
                    user?.id ? (values) => userApi.updateUser(user.id, values) : userApi.createUser
                }
                fields={[
                    {
                        name: "name",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: user?.name ?? "",
                        errorMessage: "Iltimos ismni kiriting",
                    },
                    {
                        name: "login",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: user?.login ?? "",
                        errorMessage: "Iltimos loginni kiriting",
                    },
                    {
                        name: "password",
                        validationType: "string",
                        isRequired: user ? false : true,
                        minLength: user ? 0 : 6,
                        defaultValue: user?.password ?? "",
                        errorMessage: "Iltimos parolni kiriting",
                        onSubmit: (value) => (value ? value : null),
                    },
                    {
                        name: "email",
                        validationType: "string",
                        isRequired: false,
                        defaultValue: user?.email ?? "",
                        errorMessage: "Iltimos emailni kiriting",
                    },
                    {
                        name: "phone",
                        validationType: "string",
                        isRequired: false,
                        defaultValue: user?.phone ? user.phone.replace(/^\+/, "") : "",
                        errorMessage: "Iltimos telefon raqamini kiriting",
                        onSubmit: (value: any) => {
                            if (!value) return null;
                            return value.startsWith("+") ? value : `+${value}`;
                        },
                    },
                    {
                        name: "status",
                        validationType: "boolean",
                        defaultValue: Boolean(user?.status),
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                    {
                        name: "role",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: user?.roles?.[0]?.name ?? "",
                        errorMessage: "Iltimos rolni tanlang",
                    },
                ]}
                onSuccess={onSuccess}
            >
                {({ isLoading, ...formRestProps }) => {
                    return (
                        <div className="gap-2">
                            <div className="grid grid-cols-2 gap-4">
                                <FormFields.Input
                                    label="Ism"
                                    name="name"
                                    radius="sm"
                                    size="sm"
                                    type="text"
                                    {...formRestProps}
                                />
                                <FormFields.Input
                                    label="Login"
                                    name="login"
                                    radius="sm"
                                    size="sm"
                                    type="text"
                                    {...formRestProps}
                                />
                                <FormFields.Input
                                    label="Parol"
                                    name="password"
                                    placeholder={user ? "Yangilash uchun kiriting" : ""}
                                    radius="sm"
                                    size="sm"
                                    type="password"
                                    {...formRestProps}
                                />
                                <FormFields.Input
                                    label="Email"
                                    name="email"
                                    radius="sm"
                                    size="sm"
                                    type="email"
                                    {...formRestProps}
                                />
                                <FormFields.Input
                                    label="Telefon raqami"
                                    name="phone"
                                    placeholder="+998901234567"
                                    radius="sm"
                                    size="sm"
                                    type="text"
                                    {...formRestProps}
                                />
                                <FormFields.Select
                                    label="Rol"
                                    name="role"
                                    options={[
                                        { label: "Admin", value: "admin" },
                                        { label: "Client", value: "client" },
                                    ]}
                                    radius="sm"
                                    size="sm"
                                    {...formRestProps}
                                />
                                <div className="flex items-center">
                                    <FormFields.Switch
                                        label="Faol"
                                        name="status"
                                        {...formRestProps}
                                    />
                                </div>
                            </div>

                            <Button
                                className="mt-6 w-full"
                                color="primary"
                                isLoading={isLoading}
                                radius="sm"
                                type="submit"
                            >
                                {user ? "O'zgartirish" : "Yaratish"}
                            </Button>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
