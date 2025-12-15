import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

import { Form, FormFields, Modal } from "@/components";
import { UploadResponse } from "@/services/api/file.api";
import { MenuItemProps, MenusApi } from "@/services/api/menu.api";

type MenuItemsModalProps = {
    setMenuItemsModal: ({
        open,
        menuItem,
        isChild,
    }: {
        open: boolean;
        menuItem?: MenuItemProps;
        lang_hash?: string;
        isChild?: boolean;
    }) => void;
    MenuModalData: {
        open: boolean;
        menuItem?: MenuItemProps;
        isChild?: boolean;
    };
};

export const MenuItemsModal = (props: MenuItemsModalProps) => {
    const {
        MenuModalData: { open, menuItem, isChild },
        setMenuItemsModal,
    } = props;
    const queryClient = useQueryClient();
    const { id } = useParams({ from: "/_main/menu/view/$id" });

    const onClose = () => {
        setMenuItemsModal({ open: false });
    };

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["menuitems"] });
        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Menu muvaffaqiyatli yaratildi",
        });
    };

    return (
        <Modal
            header={menuItem ? "Menuni o'zgartirish" : "Menu yaratish"}
            isOpen={open}
            onClose={onClose}
        >
            <Form
                key={menuItem?.id}
                fetchFunction={(values: any) => {
                    const payload = {
                        ...values,
                        name: {
                            uz: values.name_uz,
                            // oz: values.name_oz,
                            ru: values.name_ru,
                            // en: values.name_en,
                        },
                    };
                    delete payload.name_uz;
                    // delete payload.name_oz;
                    delete payload.name_ru;
                    // delete payload.name_en;

                    if (menuItem && !isChild) {
                        return MenusApi.updateMenuItem(menuItem.id, payload);
                    }
                    return MenusApi.createMenuItem(payload);
                }}
                fields={[
                    {
                        name: "name_uz",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: !isChild && menuItem ? menuItem.name.uz : "",
                        errorMessage: "Iltimos sarlavha (UZ) nomini kiriting",
                    },
                    // {
                    //     name: "name_oz",
                    //     validationType: "string",
                    //     isRequired: true,
                    //     defaultValue: !isChild && menuItem ? menuItem.name.oz : "",
                    //     errorMessage: "Iltimos sarlavha (OZ) nomini kiriting",
                    // },
                    {
                        name: "name_ru",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: !isChild && menuItem ? menuItem.name.ru : "",
                        errorMessage: "Iltimos sarlavha (RU) nomini kiriting",
                    },

                    // {
                    //     name: "name_en",
                    //     validationType: "string",
                    //     isRequired: true,
                    //     defaultValue: !isChild && menuItem ? menuItem.name.en : "",
                    //     errorMessage: "Iltimos sarlavha (EN) nomini kiriting",
                    // },
                    {
                        name: "menu_id",
                        validationType: "number",
                        isRequired: true,
                        defaultValue: Number(id),
                    },
                    {
                        name: "parent_id",
                        validationType: "any",
                        isRequired: true,
                        //  @ts-ignore
                        defaultValue:
                            isChild && menuItem
                                ? menuItem.id
                                : !isChild && menuItem?.parent_id
                                  ? menuItem?.parent_id
                                  : null,
                    },
                    {
                        name: "slug",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: !isChild && menuItem ? menuItem.slug : "",
                        errorMessage: "Iltimos menu slugini kiriting",
                    },

                    {
                        name: "sort",
                        validationType: "string",
                        isRequired: false,
                        defaultValue: !isChild && menuItem ? String(menuItem.sort) : "",
                        errorMessage: "Iltimos tartib raqamini kiriting",
                        onSubmit: (value) => Number(value),
                    },

                    {
                        name: "status",
                        validationType: "boolean",
                        defaultValue: isChild ? false : Boolean(menuItem?.status),
                        onSubmit: (value) => (value ? 1 : 0),
                    },

                    {
                        name: "icon",
                        validationType: "any",
                        isRequired: false,
                        defaultValue: menuItem?.icon?.id ?? "",
                        errorMessage: "Iltimos rasm  yuklang",
                    },
                ]}
                onSuccess={onSuccess}
            >
                {({ isLoading, ...formRestProps }) => {
                    return (
                        <div className="flex flex-col gap-4">
                            {/* <FormFields.Input
                                label="Nomi (OZ)"
                                name="name_oz"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            /> */}
                            <FormFields.Input
                                label="Nomi (UZ)"
                                name="name_uz"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />
                            <FormFields.Input
                                label="Nomi (RU)"
                                name="name_ru"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />
                            {/* <FormFields.Input
                                label="Nomi (EN)"
                                name="name_en"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            /> */}

                            <FormFields.Input
                                label="Slug"
                                name="slug"
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
                            <FormFields.FileUpload
                                accept="image/*"
                                defaultFiles={
                                    !isChild && menuItem && menuItem?.icon
                                        ? [menuItem.icon as UploadResponse]
                                        : []
                                }
                                label="Icon yuklash"
                                multiple={false}
                                name="icon"
                                {...formRestProps}
                            />

                            <FormFields.Switch label="Status" name="status" {...formRestProps} />
                            <Button color="primary" isLoading={isLoading} radius="sm" type="submit">
                                {menuItem?.id ? "O'zgartirish" : "Yaratish"}
                            </Button>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
