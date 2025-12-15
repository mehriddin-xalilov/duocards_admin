import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { Form, FormFields, Modal } from "@/components";
import { TypesApi, TypesItemType } from "@/services/api/types.api";

type typesModalProps = {
    name: string;
    isOpen: boolean;
    onClose: () => void;
    types: TypesItemType | null;
    isChild?: boolean;
};

export const TypesModal = (props: typesModalProps) => {
    const { name, isOpen, onClose, types, isChild } = props;

    const queryClient = useQueryClient();

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: [name] });

        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Tur muvaffaqiyatli yaratildi",
        });
    };
    const text = isChild ? "Subtur yaratish" : types ? "Turni o'zgartirish" : "Turn yaratish";

    const typeName = types?.name?.uz;

    return (
        <Modal header={isChild ? `(${typeName}) ${text}` : text} isOpen={isOpen} onClose={onClose}>
            <Form
                fetchFunction={(values) => {
                    const payload = {
                        name: {
                            uz: values.name_uz,
                            ru: values.name_ru,
                            oz: values.name_oz,
                            en: values.name_en,
                        },
                        ...(values.parent_id && { parent_id: values.parent_id }),
                        status: values.status ? 1 : 0,
                    };

                    if (types && !isChild) {
                        return TypesApi.updateTypes(types.id, payload);
                    }

                    return TypesApi.createTypes(payload);
                }}
                fields={[
                    {
                        name: "name_uz",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: isChild ? "" : (types?.name.uz ?? ""),
                        errorMessage: "Iltimos sarlavha (UZ) nomini kiriting",
                    },
                    // {
                    //     name: "name_oz",
                    //     validationType: "string",
                    //     isRequired: true,
                    //     defaultValue: isChild ? "" : (types?.name?.oz ?? ""),
                    //     errorMessage: "Iltimos sarlavha (OZ) nomini kiriting",
                    // },
                    {
                        name: "name_ru",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: isChild ? "" : (types?.name?.ru ?? ""),
                        errorMessage: "Iltimos sarlavha (RU) nomini kiriting",
                    },

                    // {
                    //     name: "name_en",
                    //     validationType: "string",
                    //     isRequired: true,
                    //     defaultValue: isChild ? "" : (types?.name?.en ?? ""),
                    //     errorMessage: "Iltimos sarlavha (EN) nomini kiriting",
                    // },
                    {
                        name: "parent_id",
                        validationType: "any",
                        defaultValue:
                            isChild && types
                                ? types.id
                                : !isChild && types?.parent_id
                                  ? types?.parent_id
                                  : "",
                    },

                    {
                        name: "status",
                        validationType: "boolean",
                        defaultValue: isChild ? false : (Boolean(types?.status) ?? false),
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

                            <FormFields.Switch label="Status" name="status" {...formRestProps} />
                            <Button color="primary" isLoading={isLoading} radius="sm" type="submit">
                                {types && !isChild ? "O'zgartirish" : "Yaratish"}
                            </Button>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
