import { useMemo, useState } from "react";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { TabComponent } from "./Tabs";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";

import { Form, FormFields, Modal } from "@/components";
import { documentApi, DocumentItemType } from "@/services/api/documents.api";
import { ValidationField } from "@/components/Form/types";
import { Download, Edit, Paperclip, X } from "lucide-react";

type DocumentModalProps = {
    setDocumentModal: ({ open, document }: { open: boolean; document?: DocumentItemType }) => void;
    documentDataModal: { open: boolean; document?: DocumentItemType };
};

export const DocumentsModal = (props: DocumentModalProps) => {
    const {
        documentDataModal: { open, document },
        setDocumentModal,
    } = props;
    const queryClient = useQueryClient();
    const [lang, setLang] = useState("uz");
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const onClose = () => {
        setDocumentModal({ open: false });
        setLang("uz");
    };

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["document"] });
        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Muvaffaqiyatli yaratildi",
        });
    };

    const fields = useMemo(() => {
        const baseFields: ValidationField[] = [
            {
                name: `title_uz`,
                validationType: "string",
                defaultValue: document?.title?.uz ?? "",
                errorMessage: "Iltimos sarlavhani kiriting",
            },
            // {
            //     name: `title_oz`,
            //     validationType: "string",
            //     defaultValue: banner?.title?.oz ?? "",
            //     errorMessage: "Iltimos sarlavhani kiriting",
            // },

            {
                name: `title_ru`,
                validationType: "string",
                defaultValue: document?.title?.ru ?? "",
                errorMessage: "Iltimos sarlavhani kiriting",
            },
            {
                name: "sort",
                validationType: "string",
                isRequired: true,
                defaultValue: String(document?.sort) ?? "",
                errorMessage: "Iltimos tartib raqamini kiriting",
                onSubmit: (value) => Number(value),
            },

            {
                name: `documents`,
                validationType: "array",
                defaultValue: document?.documents ?? [],
                errorMessage: "Iltimos sarlavhani kiriting",
            },
            // {
            //     name: `title_en`,
            //     validationType: "string",
            //     defaultValue: banner?.title?.en ?? "",
            //     errorMessage: "Iltimos sarlavhani kiriting",
            // },
            // {
            //     name: `description_uz`,
            //     validationType: "string",
            //     defaultValue: banner?.description?.uz ?? "",
            //     errorMessage: "Iltimos tavsifni kiriting",
            // },
            // {
            //     name: `description_oz`,
            //     validationType: "string",
            //     defaultValue: banner?.description?.oz ?? "",
            //     errorMessage: "Iltimos tavsifni kiriting",
            // },
            // {
            //     name: `description_en`,
            //     validationType: "string",
            //     defaultValue: banner?.description?.en ?? "",
            //     errorMessage: "Iltimos tavsifni kiriting",
            // },
            // {
            //     name: `description_ru`,
            //     validationType: "string",
            //     defaultValue: banner?.description?.ru ?? "",
            //     errorMessage: "Iltimos tavsifni kiriting",
            // },
            {
                name: "status",
                validationType: "boolean",
                defaultValue: Boolean(document?.status),
                onSubmit: (value) => (value ? 1 : 0),
            },
        ];

        return baseFields;
    }, [document]);

    return (
        <Modal header={document ? "O'zgartirish" : "Yaratish"} isOpen={open} onClose={onClose}>
            <TabComponent modal={true} onChange={(e) => setLang(e)} />
            <Form
                key={document?.id}
                fetchFunction={(values) => {
                    console.log(values, "submit");
                    const payload = {
                        title: {
                            uz: values.title_uz,
                            // oz: values.title_oz,
                            // en: values.title_en,
                            ru: values.title_ru,
                        },
                        // description: {
                        //     uz: values.description_uz,
                        //     // oz: values.description_oz,
                        //     // en: values.description_en,
                        //     ru: values.description_ru,
                        // },
                        status: values.status,
                        sort: values.sort,
                        documents: values.documents.map((item: any) => ({
                            document: item.id,
                            name: {
                                uz: item?.name_uz
                                    ? item?.name_uz
                                    : item?.name?.uz
                                      ? item?.name?.uz
                                      : "",
                                ru: item?.name_ru
                                    ? item?.name_ru
                                    : item?.name?.ru
                                      ? item?.name?.ru
                                      : "",
                            },
                        })),
                    };

                    return document?.id
                        ? documentApi.updateDocument(document.id, payload)
                        : documentApi.createDocument(payload);
                }}
                fields={fields}
                onSuccess={onSuccess}
                onValuesChange={(val) => console.log(val)}
            >
                {({ isLoading, setValue, ...formRestProps }) => {
                    const files = formRestProps.watch("documents");
                    console.log(files);
                    return (
                        <div className="flex flex-col gap-4">
                            {/* {lang === "oz" && (
                                <>
                                    <FormFields.Textarea
                                        label="Sarlavha"
                                        name={`title_oz`}
                                        radius="sm"
                                        type="text"
                                        setValue={setValue}
                                        {...formRestProps}
                                    />
                                    <FormFields.Textarea
                                        label="Tavsif"
                                        name={`description_oz`}
                                        setValue={setValue}
                                        radius="sm"
                                        type="text"
                                        {...formRestProps}
                                    />
                                </>
                            )} */}

                            {String(lang) === "ru" && (
                                <>
                                    <FormFields.Textarea
                                        label="Sarlavha"
                                        name={`title_ru`}
                                        radius="sm"
                                        type="text"
                                        setValue={setValue}
                                        {...formRestProps}
                                    />
                                    {/* <FormFields.Textarea
                                        label="Tavsif"
                                        name={`description_ru`}
                                        setValue={setValue}
                                        radius="sm"
                                        type="text"
                                        {...formRestProps}
                                    /> */}
                                </>
                            )}
                            {/* {lang === "en" && (
                                <>
                                    <FormFields.Textarea
                                        label="Sarlavha"
                                        name={`title_en`}
                                        radius="sm"
                                        type="text"
                                        setValue={setValue}
                                        {...formRestProps}
                                    />
                                    <FormFields.Textarea
                                        label="Tavsif"
                                        name={`description_en`}
                                        setValue={setValue}
                                        radius="sm"
                                        type="text"
                                        {...formRestProps}
                                    />
                                </>
                            )} */}
                            {String(lang) === "uz" && (
                                <>
                                    <FormFields.Textarea
                                        label="Sarlavha"
                                        name={`title_uz`}
                                        radius="sm"
                                        type="text"
                                        setValue={setValue}
                                        {...formRestProps}
                                    />
                                    {/* <FormFields.Textarea
                                        label="Tavsif"
                                        name={`description_uz`}
                                        setValue={setValue}
                                        radius="sm"
                                        type="text"
                                        {...formRestProps}
                                    /> */}
                                </>
                            )}

                            <FormFields.Input
                                label="Tartib raqami"
                                name="sort"
                                radius="sm"
                                setValue={setValue}
                                type="number"
                                {...formRestProps}
                            />
                            <FormFields.FileUpload
                                full={true}
                                isFile={true}
                                isPreview={false}
                                label=""
                                multiple={true}
                                isOnly={["file"]}
                                name={`documents`}
                                setValue={setValue}
                                {...formRestProps}
                            />
                            {files?.length > 0 && (
                                <div className="flex gap-[8px] flex-col h-[200px] overflow-x-scroll">
                                    {files.map((item: any, index: any) => {
                                        return (
                                            <div className="bg-[#E9EAEC] px-[12px] py-[8px]  flex items-center rounded-2xl h-fit w-full justify-between">
                                                <Paperclip
                                                    width={20}
                                                    height={20}
                                                    className="shrink-0 mr-3"
                                                />

                                                {String(lang) === "uz" && (
                                                    <>
                                                        <h2 className="text-black text-[12px] leading-[16px] font-[Inter] ml-[8px] mr-[16px] w-[60%]">
                                                            {item?.name_uz
                                                                ? item?.name_uz
                                                                : item?.name?.uz
                                                                  ? item?.name?.uz
                                                                  : ""}
                                                        </h2>
                                                    </>
                                                )}

                                                {String(lang) === "ru" && (
                                                    <>
                                                        <h2 className="text-black text-[12px] leading-[16px] font-[Inter] ml-[8px] mr-[16px] w-[60%]">
                                                            {item?.name_ru
                                                                ? item?.name_ru
                                                                : item?.name?.ru
                                                                  ? item?.name?.ru
                                                                  : ""}
                                                        </h2>
                                                    </>
                                                )}

                                                <div className="flex items-center">
                                                    <Popover
                                                        isOpen={editIndex === index}
                                                        onOpenChange={(open) =>
                                                            setEditIndex(open ? index : null)
                                                        }
                                                        placement="left"
                                                        showArrow
                                                        backdrop="opaque"
                                                    >
                                                        <PopoverTrigger>
                                                            <Edit
                                                                color="#006FEE"
                                                                width={15}
                                                                height={15}
                                                                className="shrink-0 cursor-pointer border-0 ring-0 outline-0"
                                                            />
                                                        </PopoverTrigger>

                                                        <PopoverContent className="p-4 w-[320px]">
                                                            <div className="space-y-4 w-full">
                                                                {String(lang) === "uz" && (
                                                                    <FormFields.Textarea
                                                                        label="Nomi"
                                                                        name={`documents.${index}.name_uz`}
                                                                        radius="sm"
                                                                        setValue={setValue}
                                                                        defaultValue={
                                                                            item?.name?.uz || ""
                                                                        }
                                                                        type="text"
                                                                        {...formRestProps}
                                                                    />
                                                                )}

                                                                {String(lang) === "ru" && (
                                                                    <FormFields.Textarea
                                                                        label="Nomi"
                                                                        name={`documents.${index}.name_ru`}
                                                                        radius="sm"
                                                                        setValue={setValue}
                                                                        defaultValue={
                                                                            item?.name?.ru || ""
                                                                        }
                                                                        type="text"
                                                                        {...formRestProps}
                                                                    />
                                                                )}

                                                                {/* Save button */}
                                                                <Button
                                                                    color="primary"
                                                                    size="sm"
                                                                    radius="sm"
                                                                    fullWidth
                                                                    onPress={() => {
                                                                        const newValueUz =
                                                                            formRestProps.getValues(
                                                                                `documents.${index}.name_uz`,
                                                                            );
                                                                        const newValueRu =
                                                                            formRestProps.getValues(
                                                                                `documents.${index}.name_ru`,
                                                                            );

                                                                        setValue(
                                                                            `documents.${index}.name_uz`,
                                                                            newValueUz,
                                                                        );
                                                                        setValue(
                                                                            `documents.${index}.name_ru`,
                                                                            newValueRu,
                                                                        );

                                                                        setEditIndex(null); // popoverni yopish
                                                                    }}
                                                                >
                                                                    O‘zgartirish
                                                                </Button>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>

                                                    <a
                                                        href={item?.thumbnails?.normal?.src}
                                                        download
                                                        className="ml-2"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Download
                                                            color="#006FEE"
                                                            width={15}
                                                            height={15}
                                                            className="shrink-0 cursor-pointer mr-3"
                                                        />
                                                    </a>
                                                    <X
                                                        width={20}
                                                        height={20}
                                                        className="shrink-0 cursor-pointer"
                                                        onClick={() => {
                                                            const newFiles = files.filter(
                                                                (_: any, i: any) => i !== index,
                                                            );
                                                            setValue("documents", newFiles);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <FormFields.Switch
                                label="Status"
                                name="status"
                                {...formRestProps}
                                setValue={setValue}
                            />
                            <Button color="primary" isLoading={isLoading} radius="sm" type="submit">
                                {document?.id ? "O'zgartirish" : "Yaratish"}
                            </Button>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
