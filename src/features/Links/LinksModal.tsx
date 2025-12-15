import { useMemo } from "react";

import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { Form, FormFields, Modal } from "@/components";
import { UploadResponse } from "@/services/api/file.api";
import { linksApi, LinksItemType } from "@/services/api/links.api";
import { ValidationField } from "@/components/Form/types";

type LinksModalProps = {
    setLinksModal: ({ open, link }: { open: boolean; link?: LinksItemType }) => void;
    linksDataModal: { open: boolean; link?: LinksItemType };
};

export const LinksModal = (props: LinksModalProps) => {
    const {
        linksDataModal: { open, link },
        setLinksModal,
    } = props;
    const queryClient = useQueryClient();

    // useEffect(() => {
    //     if (search.lang) {
    //         setLang(search.lang ? search.lang : "oz");
    //     }
    // }, [search.lang]);

    const onClose = () => {
        setLinksModal({ open: false });
    };

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["links"] });
        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Havola muvaffaqiyatli yaratildi",
        });
    };

    const fields = useMemo(() => {
        const baseFields: ValidationField[] = [
            {
                name: "name_uz",
                validationType: "string",
                isRequired: true,
                defaultValue: link?.name.uz ?? "",
                errorMessage: "Iltimos sarlavha (UZ) nomini kiriting",
            },
            // {
            //     name: "name_oz",
            //     validationType: "string",
            //     isRequired: true,
            //     defaultValue: link?.name?.oz ?? "",
            //     errorMessage: "Iltimos sarlavha (OZ) nomini kiriting",
            // },
            {
                name: "name_ru",
                validationType: "string",
                isRequired: true,
                defaultValue: link?.name?.ru ?? "",
                errorMessage: "Iltimos sarlavha (RU) nomini kiriting",
            },

            // {
            //     name: "name_en",
            //     validationType: "string",
            //     isRequired: true,
            //     defaultValue: link?.name?.en ?? "",
            //     errorMessage: "Iltimos sarlavha (EN) nomini kiriting",
            // },
            {
                name: "link",
                validationType: "string",
                isRequired: true,
                defaultValue: link?.link ?? "",
                errorMessage: "Iltimos link kiriting",
            },
            {
                name: "sort",
                validationType: "string",
                isRequired: true,
                defaultValue: String(link?.sort) ?? "",
                errorMessage: "Iltimos tartib raqamini kiriting",
                onSubmit: (value) => Number(value),
            },

            {
                name: "status",
                validationType: "boolean",
                defaultValue: Boolean(link?.status),
                onSubmit: (value) => (value ? 1 : 0),
            },
            {
                name: "logo",
                validationType: "number",
                isRequired: true,
                defaultValue: link?.logo?.id ?? "",
                errorMessage: "Iltimos rasm yuklang",
            },
        ];

        return baseFields;
    }, [link]);

    return (
        <Modal
            header={link ? "Havolani o'zgartirish" : "Havola yaratish"}
            isOpen={open}
            size="5xl"
            onClose={onClose}
        >
            <Form
                key={link?.id}
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

                    return link?.id
                        ? linksApi.updateLink(link.id, payload)
                        : linksApi.createLink(payload);
                }}
                fields={fields}
                onSuccess={onSuccess}
                onValuesChange={(val) => console.log(val)}
            >
                {({ isLoading, setValue, ...formRestProps }) => {
                    return (
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-3">
                                <FormFields.Textarea
                                    label="Sarlavha (UZ)"
                                    name="name_uz"
                                    radius="sm"
                                    setValue={setValue}
                                    type="text"
                                    {...formRestProps}
                                />
                                {/* <FormFields.Textarea
                                    label="Sarlavha (OZ)"
                                    name="name_oz"
                                    radius="sm"
                                    type="text"
                                    setValue={setValue}
                                    {...formRestProps}
                                /> */}
                                <FormFields.Textarea
                                    label="Sarlavha (RU)"
                                    name="name_ru"
                                    radius="sm"
                                    type="text"
                                    setValue={setValue}
                                    {...formRestProps}
                                />
                            </div>

                            {/* <div className="flex gap-3">
                                <FormFields.Textarea
                                    label="Sarlavha (RU)"
                                    name="name_ru"
                                    radius="sm"
                                    type="text"
                                    setValue={setValue}
                                    {...formRestProps}
                                />
                                <FormFields.Textarea
                                    label="Sarlavha (EN)"
                                    name="name_en"
                                    radius="sm"
                                    type="text"
                                    setValue={setValue}
                                    {...formRestProps}
                                />
                            </div> */}

                            <div className="w-full flex gap-3">
                                <div className="w-[50%] flex flex-col gap-3">
                                    <FormFields.FileUpload
                                        accept="image/*"
                                        defaultFiles={
                                            link?.logo ? [link.logo as UploadResponse] : []
                                        }
                                        label="Rasm yuklash"
                                        multiple={false}
                                        setValue={setValue}
                                        isOnly={["img"]}
                                        name="logo"
                                        {...formRestProps}
                                    />
                                    <FormFields.Switch
                                        label="Status"
                                        name="status"
                                        {...formRestProps}
                                        setValue={setValue}
                                    />
                                </div>
                                <div className="flex flex-col gap-3 w-[50%] mt-9">
                                    <FormFields.Input
                                        label="Link"
                                        name="link"
                                        setValue={setValue}
                                        radius="sm"
                                        type="text"
                                        {...formRestProps}
                                    />

                                    <FormFields.Input
                                        label="Tartib raqami"
                                        name="sort"
                                        radius="sm"
                                        setValue={setValue}
                                        type="number"
                                        {...formRestProps}
                                    />
                                    <Button
                                        color="primary"
                                        isLoading={isLoading}
                                        radius="sm"
                                        type="submit"
                                    >
                                        {link?.id ? "O'zgartirish" : "Yaratish"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
