import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { Form, FormFields, Modal } from "@/components";
import { CategoriesApi, CategoriesItemType } from "@/services/api/categories.api";

type CategoriesModalProps = {
    name: string;
    isOpen: boolean;
    onClose: () => void;
    categories: CategoriesItemType | null;
    isChild?: boolean;
};

export const CategoriesModal = (props: CategoriesModalProps) => {
    const { name, isOpen, onClose, categories, isChild } = props;

    const queryClient = useQueryClient();

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: [name] });

        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Kategoriya muvaffaqiyatli yaratildi",
        });
    };
    const text = isChild
        ? "Subkategoriya yaratish"
        : categories
          ? "Kategoriya ni o'zgartirish"
          : "Kategoriya yaratish";

    const categoryName = categories?.name?.uz;

    return (
        <Modal
            header={isChild ? `(${categoryName}) ${text}` : text}
            isOpen={isOpen}
            onClose={onClose}
        >
            <Form
                fetchFunction={(values) => {
                    const payload = {
                        slug: values.slug,
                        name: {
                            uz: values.name_uz,
                            ru: values.name_ru,
                            // oz: values.name_oz,
                            // en: values.name_en,
                        },
                        ...(values.parent_id && { parent_id: values.parent_id }),
                        status: values.status ? 1 : 0,
                    };

                    if (categories && !isChild) {
                        return CategoriesApi.updateCategories(categories.id, payload);
                    }

                    return CategoriesApi.createCategories(payload);
                }}
                fields={[
                    {
                        name: "name_uz",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: isChild ? "" : (categories?.name.uz ?? ""),
                        errorMessage: "Iltimos sarlavha (UZ) nomini kiriting",
                    },
                    // {
                    //     name: "name_oz",
                    //     validationType: "string",
                    //     isRequired: true,
                    //     defaultValue: isChild ? "" : (categories?.name?.oz ?? ""),
                    //     errorMessage: "Iltimos sarlavha (OZ) nomini kiriting",
                    // },
                    {
                        name: "name_ru",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: isChild ? "" : (categories?.name?.ru ?? ""),
                        errorMessage: "Iltimos sarlavha (RU) nomini kiriting",
                    },

                    // {
                    //     name: "name_en",
                    //     validationType: "string",
                    //     isRequired: true,
                    //     defaultValue: isChild ? "" : (categories?.name?.en ?? ""),
                    //     errorMessage: "Iltimos sarlavha (EN) nomini kiriting",
                    // },
                    {
                        name: "parent_id",
                        validationType: "any",
                        defaultValue:
                            isChild && categories
                                ? categories.id
                                : !isChild && categories?.parent_id
                                  ? categories?.parent_id
                                  : "",
                    },
                    {
                        name: "slug",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: isChild ? "" : (categories?.slug ?? ""),
                        errorMessage: "Iltimos slugni kiriting",
                    },

                    {
                        name: "status",
                        validationType: "boolean",
                        defaultValue: isChild ? false : (Boolean(categories?.status) ?? false),
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                ]}
                onSuccess={onSuccess}
            >
                {({ isLoading, ...formRestProps }) => {
                    return (
                        <div className="flex flex-col gap-4">
                            <FormFields.Input
                                label="Sarlavha (UZ)"
                                name="name_uz"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />
                            {/* <FormFields.Input
                                label="Sarlavha (OZ)"
                                name="name_oz"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            /> */}
                            <FormFields.Input
                                label="Sarlavha (RU)"
                                name="name_ru"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />
                            {/* <FormFields.Input
                                label="Sarlavha (EN)"
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

                            <FormFields.Switch label="Status" name="status" {...formRestProps} />
                            <Button color="primary" isLoading={isLoading} radius="sm" type="submit">
                                {categories && !isChild ? "O'zgartirish" : "Yaratish"}
                            </Button>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
