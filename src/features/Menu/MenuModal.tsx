import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { Form, FormFields, Modal } from "@/components";
import { MenuProps, MenusApi } from "@/services/api/menu.api";

type MenusModalProps = {
    name: string;
    isOpen: boolean;
    onClose: () => void;
    menus: MenuProps | null;
    isChild: boolean;
};

export const MenuModal = (props: MenusModalProps) => {
    const { name, isOpen, onClose, menus, isChild } = props;

    const queryClient = useQueryClient();

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: [name] });

        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Menu muvaffaqiyatli yaratildi",
        });
    };

    console.log(menus, isChild);
    return (
        <Modal
            header={menus ? "Menuni o'zgartirish" : "Menu yaratish"}
            isOpen={isOpen}
            onClose={onClose}
        >
            <Form
                fetchFunction={(values) => {
                    const payload = {
                        name: {
                            uz: values.name_uz,
                            ru: values.name_ru,
                        },
                        alias: values.alias,
                        status: values.status,
                        link: values.link,
                        is_page: values.is_page,
                        parent_id: values.parent_id,
                        sort: values.sort,
                    };

                    if (menus && !isChild) {
                        return MenusApi.updateMenu(menus.id, payload);
                    }
                    return MenusApi.createMenu(payload);
                }}
                fields={[
                    {
                        name: "name_uz",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: !isChild && menus ? menus.name.uz : "",
                        errorMessage: "Iltimos menu nomini nomini kiriting (UZ)",
                    },
                    {
                        name: "parent_id",
                        validationType: "any",
                        isRequired: true,
                        //  @ts-ignore
                        defaultValue:
                            isChild && menus
                                ? menus.id
                                : !isChild && menus?.parent_id
                                  ? menus?.parent_id
                                  : null,
                    },
                    {
                        name: "name_ru",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: !isChild && menus ? menus.name.ru : "",
                        errorMessage: "Iltimos menu nomini nomini kiriting (RU)",
                    },
                    {
                        name: "link",
                        validationType: "string",
                        defaultValue: !isChild && menus ? menus.link : "",
                        errorMessage: "Iltimos link kiriting",
                    },
                    {
                        name: "is_page",
                        validationType: "boolean",
                        defaultValue: isChild ? false : Boolean(menus?.is_page),
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                    {
                        name: "sort",
                        validationType: "string",
                        isRequired: false,
                        defaultValue: !isChild && menus ? String(menus.sort) : "",
                        errorMessage: "Iltimos tartib raqamini kiriting",
                        onSubmit: (value) => Number(value),
                    },
                    {
                        name: "status",
                        validationType: "boolean",
                        defaultValue: Boolean(menus?.status),
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                    {
                        name: "alias",
                        validationType: "string",
                        defaultValue: !isChild && menus ? menus.alias : "",
                        errorMessage: "Iltimos menu alias ni kiriting",
                    },
                ]}
                onSuccess={onSuccess}
            >
                {({ isLoading, ...formRestProps }) => {
                    return (
                        <div className="flex flex-col gap-4">
                            <FormFields.Input
                                label="Menu nomi (UZ)"
                                name="name_uz"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />
                            <FormFields.Input
                                label="Menu nomi (RU)"
                                name="name_ru"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />
                            <FormFields.Input
                                label="Menu alias si"
                                name="alias"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />
                            <FormFields.Input
                                label="Link"
                                name="link"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />
                            <FormFields.Input
                                label="Tartib raqami"
                                name="sort"
                                radius="sm"
                                type="number"
                                {...formRestProps}
                            />
                            <FormFields.Switch
                                label="Sahifa menusi"
                                name="is_page"
                                {...formRestProps}
                            />
                            <FormFields.Switch label="Status" name="status" {...formRestProps} />
                            <Button color="primary" isLoading={isLoading} radius="sm" type="submit">
                                {menus ? "O'zgartirish" : "Yaratish"}
                            </Button>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
