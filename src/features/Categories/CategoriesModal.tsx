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

    const categoryName = categories?.name;

    return (
        <Modal
            header={isChild ? `(${categoryName}) ${text}` : text}
            isOpen={isOpen}
            onClose={onClose}
        >
            <Form
                fetchFunction={(values) => {
                    const payload = {
                        name: values.name,
                        ...(values.parent_id && { parent_id: values.parent_id }),
                        ...(values.icon && { icon: values.icon }),
                    };

                    if (categories && !isChild) {
                        return CategoriesApi.updateCategories(categories.id, payload);
                    }

                    return CategoriesApi.createCategories(payload);
                }}
                fields={[
                    {
                        name: "name",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: isChild ? "" : (categories?.name ?? ""),
                        errorMessage: "Iltimos sarlavha nomini kiriting",
                    },
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
                        name: "icon",
                        validationType: "any",
                        defaultValue: isChild ? "" : (categories?.icon ?? ""),
                    },
                ]}
                onSuccess={onSuccess}
            >
                {({ isLoading, ...formRestProps }) => {
                    return (
                        <div className="flex flex-col gap-4">
                            <FormFields.Input
                                label="Sarlavha"
                                name="name"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />
                            <FormFields.FileUpload
                                {...formRestProps}
                                isOnly="img"
                                label="Ikonka yuklash"
                                name="icon"
                            />
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
