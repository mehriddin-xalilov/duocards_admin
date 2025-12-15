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

export const ProfileModal = (props: userModalProps) => {
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
        localStorage.removeItem("user");
        window.location.reload();
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
                        errorMessage: "Iltimos sarlavhani kiriting",
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
                        isRequired: true,
                        defaultValue: user?.email ?? "",
                        errorMessage: "Iltimos emailni kiriting",
                    },
                    {
                        name: "login",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: user?.login ?? "",
                        errorMessage: "Iltimos loginni kiriting",
                    },
                    {
                        name: "phone",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: user?.phone ? user.phone.replace(/^\+/, "") : "",
                        errorMessage: "Iltimos telefon raqamini kiriting",
                        onSubmit: (value: any) => {
                            if (!value) return null;

                            return value.startsWith("+") ? value : `+${value}`;
                        },
                    },

                    {
                        name: "photo",
                        validationType: "number",
                        isRequired: true,
                        defaultValue: user?.photo?.id ?? "",
                        errorMessage: "Iltimos ava  yuklang",
                    },

                    {
                        name: "role",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: user?.user_role?.role ?? "",
                        errorMessage: "Iltimos rolni tanlang",
                    },
                ]}
                onSuccess={onSuccess}
            >
                {({ isLoading, ...formRestProps }) => {
                    return (
                        <div className=" gap-2 ">
                            <div className="grid grid-cols-2 gap-2 ">
                                <FormFields.Input
                                    label="Ism"
                                    name="name"
                                    radius="sm"
                                    size="sm"
                                    type="text"
                                    {...formRestProps}
                                />
                                <FormFields.Input
                                    label="Foydalanuvchi nomi"
                                    name="login"
                                    radius="sm"
                                    size="sm"
                                    type="text"
                                    {...formRestProps}
                                />
                                <FormFields.Input
                                    label="Parol"
                                    name="password"
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
                                    radius="sm"
                                    size="sm"
                                    type="number"
                                    {...formRestProps}
                                />
                                <FormFields.Select
                                    disabled
                                    label="Rol"
                                    name="role"
                                    options={[
                                        { label: "Admin", value: "admin" },
                                        { label: "Moderator", value: "moderator" },
                                        { label: "Yozuvchi", value: "writer" },
                                    ]}
                                    radius="sm"
                                    size="sm"
                                    {...formRestProps}
                                />
                            </div>

                            <div className="w-[100%]  mt-[20px] items-center justify-between">
                                <div className="w-[50%]  mb-[20px]">
                                    <FormFields.FileUpload
                                        accept="image/*"
                                        defaultFiles={
                                            user?.photo ? [user.photo as UploadResponse] : []
                                        }
                                        label="Ava yuklash"
                                        multiple={false}
                                        name="photo"
                                        {...formRestProps}
                                    />
                                </div>
                            </div>
                            <Button
                                className="mt-[20px] w-full"
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
